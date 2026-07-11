# Web App Setup

This repository now contains a base web app scaffold:

```text
frontend/  Next.js camera interface
backend/   FastAPI API, PyTorch inference, Spotify integration
```

## 1. Backend

```sh
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/api/health
```

## 2. Frontend

```sh
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## 3. Real Model Mode

The backend currently supports demo predictions through:

```text
MOCK_INFERENCE=true
```

To use the real model, place the trained file here:

```text
backend/app/models/model_5e5.pth
```

Then update `backend/.env`:

```text
MOCK_INFERENCE=false
```

The class labels are stored in:

```text
backend/app/models/labels.json
```

## 4. Spotify

Create a Spotify developer app and set the redirect URI to:

```text
http://localhost:8000/api/spotify/callback
```

Then fill these values in `backend/.env`:

```text
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=http://localhost:8000/api/spotify/callback
```

Without Spotify login, the app returns demo tracks so the basic user flow still works.
