from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import requests

from app.config import get_settings
from app.inference import classifier
from app.schemas import EmotionPrediction, PlaylistRequest, PlaylistResponse
from app.spotify import spotify_service


settings = get_settings()

app = FastAPI(title="FER Music Playlist API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "environment": settings.app_env}


@app.post("/api/predict-emotion", response_model=EmotionPrediction)
async def predict_emotion(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Upload an image file.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Image file is empty.")

    return classifier.predict(image_bytes)


@app.get("/api/spotify/login")
def spotify_login():
    if not settings.spotify_client_id:
        raise HTTPException(status_code=400, detail="Spotify credentials are not configured.")
    return {"url": spotify_service.login_url()}


@app.get("/api/spotify/callback")
def spotify_callback(code: str):
    try:
        token_info = spotify_service.exchange_code(code)
    except requests.RequestException as exc:
        detail = spotify_error_detail(exc, "Spotify authentication failed.")
        raise HTTPException(status_code=502, detail=detail) from exc

    access_token = token_info["access_token"]
    redirect_url = f"{settings.frontend_origin}/?spotify_token={access_token}"
    return RedirectResponse(redirect_url)


@app.post("/api/playlists", response_model=PlaylistResponse)
def create_playlist(payload: PlaylistRequest):
    try:
        tracks = spotify_service.find_tracks(payload.emotion, payload.access_token)

        if not payload.access_token:
            return PlaylistResponse(
                emotion=payload.emotion,
                playlist_url=None,
                tracks=tracks,
                message="Demo tracks returned. Connect Spotify to create a real playlist.",
            )

        playlist_url = spotify_service.create_playlist(
            payload.emotion,
            payload.access_token,
            tracks,
        )
    except requests.RequestException as exc:
        print(f"[spotify debug] exception: {exc!r}")
        if exc.response is not None:
            print(f"[spotify debug] status: {exc.response.status_code}")
            print(f"[spotify debug] body: {exc.response.text}")
        detail = spotify_error_detail(exc, "Spotify playlist request failed.")
        raise HTTPException(status_code=502, detail=detail) from exc

    return PlaylistResponse(
        emotion=payload.emotion,
        playlist_url=playlist_url,
        tracks=tracks,
        message="Playlist created.",
    )


def spotify_error_detail(exc: requests.RequestException, fallback: str) -> str:
    response = exc.response
    if response is None:
        return fallback

    try:
        data = response.json()
    except ValueError:
        return fallback

    error = data.get("error")
    if isinstance(error, dict):
        return error.get("message") or fallback
    if isinstance(error, str):
        description = data.get("error_description")
        return f"{error}: {description}" if description else error
    return fallback
