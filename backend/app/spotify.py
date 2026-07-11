import base64
import secrets
from urllib.parse import urlencode

import requests

from app.config import get_settings
from app.schemas import Track


MOOD_QUERIES = {
    "Happy": ["happy pop", "feel good", "uplifting"],
    "Sad": ["sad acoustic", "mellow", "rainy day"],
    "Angry": ["rock rage", "workout rock", "metal energy"],
    "Neutral": ["lofi chill", "calm focus", "ambient"],
}


class SpotifyService:
    def __init__(self):
        self.settings = get_settings()

    def login_url(self) -> str:
        params = {
            "client_id": self.settings.spotify_client_id,
            "response_type": "code",
            "redirect_uri": self.settings.spotify_redirect_uri,
            "scope": "playlist-modify-private playlist-read-private user-library-read",
            "state": secrets.token_urlsafe(16),
        }
        return "https://accounts.spotify.com/authorize?" + urlencode(params)

    def exchange_code(self, code: str) -> dict:
        auth = base64.b64encode(
            f"{self.settings.spotify_client_id}:{self.settings.spotify_client_secret}".encode()
        ).decode()
        response = requests.post(
            "https://accounts.spotify.com/api/token",
            headers={"Authorization": f"Basic {auth}"},
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": self.settings.spotify_redirect_uri,
            },
            timeout=15,
        )
        response.raise_for_status()
        return response.json()

    def find_tracks(self, emotion: str, access_token: str | None = None) -> list[Track]:
        if not access_token:
            return self._demo_tracks(emotion)

        headers = {"Authorization": f"Bearer {access_token}"}
        tracks: list[Track] = []

        for query in MOOD_QUERIES.get(emotion, [emotion])[:2]:
            response = requests.get(
                "https://api.spotify.com/v1/search",
                headers=headers,
                params={"q": query, "type": "track", "limit": 5},
                timeout=15,
            )
            response.raise_for_status()
            for item in response.json()["tracks"]["items"]:
                tracks.append(
                    Track(
                        name=item["name"],
                        artist=", ".join(artist["name"] for artist in item["artists"]),
                        uri=item["uri"],
                        preview_url=item.get("preview_url"),
                        spotify_url=item["external_urls"]["spotify"],
                    )
                )

        unique: dict[str, Track] = {}
        for track in tracks:
            unique[track.uri] = track
        return list(unique.values())[:10]

    def create_playlist(self, emotion: str, access_token: str, tracks: list[Track]) -> str:
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(
            "https://api.spotify.com/v1/me",
            headers=headers,
            timeout=15,
        )
        user_response.raise_for_status()
        user_id = user_response.json()["id"]

        playlist_response = requests.post(
            f"https://api.spotify.com/v1/users/{user_id}/playlists",
            headers={**headers, "Content-Type": "application/json"},
            json={
                "name": f"{emotion} Vibes Playlist",
                "public": False,
                "description": "Created from a facial expression mood estimate.",
            },
            timeout=15,
        )
        playlist_response.raise_for_status()
        playlist = playlist_response.json()

        if tracks:
            requests.post(
                f"https://api.spotify.com/v1/playlists/{playlist['id']}/tracks",
                headers={**headers, "Content-Type": "application/json"},
                json={"uris": [track.uri for track in tracks]},
                timeout=15,
            ).raise_for_status()

        return playlist["external_urls"]["spotify"]

    def _demo_tracks(self, emotion: str) -> list[Track]:
        query = MOOD_QUERIES.get(emotion, ["mood"])[0]
        return [
            Track(
                name=f"{emotion} demo track {index}",
                artist=query.title(),
                uri=f"spotify:track:demo-{emotion.lower()}-{index}",
                spotify_url=None,
            )
            for index in range(1, 6)
        ]


spotify_service = SpotifyService()
