# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Full-stack MCU watchlist dashboard. 145 titles, watched tracking, filtering/sorting by era and type.

## Development Commands

### Backend (FastAPI, Python 3.11.9)
```bash
cd backend
source venv/bin/activate          # create with: python -m venv venv && pip install -r requirements.txt
uvicorn main:app --reload         # http://localhost:8000 — also serves /docs (Swagger)
```

### Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to frontend/dist/
npm run lint     # ESLint
npm run preview  # preview production build locally
```

No test suite exists in this repository.

## Architecture

**Backend** ([backend/main.py](backend/main.py)): Single-file FastAPI app. Data lives in `backend/data/marvel_movies.json` (145 MCU titles, source of truth). Every `PATCH /api/movies/{id}/watched` call overwrites the whole JSON file — no database ORM, no transactions.

[backend/import_movies.py](backend/import_movies.py) exists to sync JSON → PostgreSQL (Supabase), but `main.py` does not use the database; the `DATABASE_URL` env var and psycopg dependency are only for that import script.

**Frontend** ([frontend/src/](frontend/src/)):
- `App.jsx` — root component owning all state (movies, filters, sort, search, loading). Fetches from `VITE_API_URL` (falls back to `http://localhost:8000`).
- `components/MovieCard.jsx` — card UI per title.
- `utils/sortMovies.js` — pure sort function with three modes: `release_date`, `chronological`, `unwatched`.

**API endpoints:**
- `GET /api/movies` — full catalog
- `PATCH /api/movies/{id}/watched` — body `{"watched": bool}`

## Environment Variables

| Var | Where | Purpose |
|-----|-------|---------|
| `DATABASE_URL` | `backend/.env` | PostgreSQL (Supabase) — only used by `import_movies.py` |
| `VITE_API_URL` | `frontend/.env.production` | Backend URL for production build |

For local dev, no env file is required — frontend defaults to `http://localhost:8000`.

## Deployment
- **Backend:** Railway (`backend/railway.toml`) — starts with `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Frontend:** Vercel — production URL `https://marvel-guide-liard.vercel.app/`
- CORS allowed origins are hard-coded in `backend/main.py`; add new Vercel preview URLs there when needed.

## Data Model
Each title in `marvel_movies.json`:
```json
{"id": 1, "title": "Iron Man", "type": "Movie|Series|Special",
 "release_date": "2008-05-02", "era": "...", "watched": false, "poster_url": ""}
```
`poster_url` is intentionally empty — poster image support is a pending feature.
