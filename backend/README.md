# FER Music Playlist Backend

FastAPI backend for emotion inference and Spotify playlist generation.

## Setup

```sh
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

The API runs at `http://localhost:3000`.

## Model

Place the trained PyTorch model at:

```text
backend/app/models/model_5e5.pth
```

Then set:

```text
MOCK_INFERENCE=false
```

Until the model file is available, `MOCK_INFERENCE=true` keeps the web app working with demo predictions.
