from pydantic import BaseModel


class EmotionPrediction(BaseModel):
    emotion: str
    confidence: float
    mode: str


class Track(BaseModel):
    name: str
    artist: str
    uri: str
    preview_url: str | None = None
    spotify_url: str | None = None


class PlaylistRequest(BaseModel):
    emotion: str
    access_token: str | None = None


class PlaylistResponse(BaseModel):
    emotion: str
    playlist_url: str | None = None
    tracks: list[Track]
    message: str
