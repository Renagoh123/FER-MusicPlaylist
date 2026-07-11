from functools import lru_cache
from pydantic import BaseModel
from dotenv import load_dotenv
import os


load_dotenv()


class Settings(BaseModel):
    app_env: str = os.getenv("APP_ENV", "development")
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    api_base_url: str = os.getenv("API_BASE_URL", "http://localhost:8000")
    model_path: str = os.getenv("MODEL_PATH", "app/models/model_5e5.pth")
    labels_path: str = os.getenv("LABELS_PATH", "app/models/labels.json")
    mock_inference: bool = os.getenv("MOCK_INFERENCE", "true").lower() == "true"
    spotify_client_id: str = os.getenv("SPOTIFY_CLIENT_ID", "")
    spotify_client_secret: str = os.getenv("SPOTIFY_CLIENT_SECRET", "")
    spotify_redirect_uri: str = os.getenv(
        "SPOTIFY_REDIRECT_URI",
        "http://127.0.0.1:8000/api/spotify/callback",
    )
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    ]

@lru_cache
def get_settings() -> Settings:
    return Settings()
