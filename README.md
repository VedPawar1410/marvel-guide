<div align="center">

<h1>Marvel Guide</h1>

<p>A personal watchlist dashboard for the Marvel Cinematic Universe. Track every movie, Disney+ series, and special across all MCU phases — sorted by release date, in-universe chronology, or by what you haven't seen yet.</p>

<br/>

<a href="https://your-deploy-url-here.com">
  <img src="https://img.shields.io/badge/View%20Live-Deploy-E23636?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMCAxNy41di0xMWw3IDUuNS03IDUuNXoiLz48L3N2Zz4=&logoColor=white" alt="View Live" />
</a>

</div>

---

## What This Is

The MCU has grown into one of the most interconnected cinematic universes ever made — spanning 30+ films, 10+ Disney+ series, and several specials. Deciding what to watch next, in what order, and keeping track of what you've already seen can be genuinely confusing.

**Marvel Guide** solves that. It is a clean, focused dashboard that gives you a live view of the entire MCU catalogue. Mark titles as watched, filter by saga or era, search by name, and switch between release-date order and in-universe chronological order — all in a single interface that persists your progress.

---

## Features

- **Full MCU Catalogue** — Movies, Disney+ series, and specials in one place
- **Watched Tracking** — Mark titles as watched; your progress is saved instantly via the backend API
- **Multiple Sort Modes** — Sort by release date, in-universe chronology, or unwatched-first
- **Era Filtering** — Filter the grid by MCU phase/era (Infinity Saga, Multiverse Saga, etc.)
- **Search** — Live search across titles and eras
- **Progress Stats** — At-a-glance counters showing your overall completion and per-type breakdowns (Movies / Series / Specials)
- **Dark Cinematic UI** — Glassmorphism cards on a dark slate background

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | FastAPI, Python, Uvicorn |
| Data | JSON flat-file (persisted on the server) |
| Icons | Lucide React |

---

## Project Structure

```
marvel-guide/
├── backend/
│   ├── main.py               # FastAPI app — serves and updates movie data
│   ├── requirements.txt
│   └── data/
│       └── marvel_movies.json  # Source of truth for all MCU titles
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Main dashboard, filters, sort, stats
        ├── components/
        │   └── MovieCard.jsx   # Individual title card with watched toggle
        └── utils/
            └── sortMovies.js   # Sort logic (release, chronological, unwatched)
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/marvel-guide.git
cd marvel-guide
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Start the frontend

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## API Reference

The FastAPI backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies` | Returns the full list of MCU titles |
| `PATCH` | `/api/movies/{id}/watched` | Updates the watched status for a title |

Interactive API docs are available at `http://localhost:8000/docs` when the backend is running.

---

## Contributing

Contributions are welcome. This project is intentionally minimal by design — the goal is a focused, fast, personal tracker.

### How to contribute

1. **Fork** this repository
2. **Create a branch** for your change: `git checkout -b feature/your-feature-name`
3. **Make your changes** and commit: `git commit -m "Add: description of change"`
4. **Push** to your fork: `git push origin feature/your-feature-name`
5. **Open a Pull Request** with a clear description of what you changed and why

### Good areas to contribute

- Adding missing MCU titles to `backend/data/marvel_movies.json`
- Fixing incorrect chronological order or release dates in the data
- UI improvements to the card layout or filter bar
- Adding poster image support to the cards
- Migrating the data layer from flat JSON to a proper database

### Data contributions

If you are only updating the movie data (adding entries, fixing dates, correcting order), you only need to edit `backend/data/marvel_movies.json`. Each entry follows this schema:

```json
{
  "id": 1,
  "title": "Iron Man",
  "type": "Movie",
  "release_date": "2008-05-02",
  "era": "The Infinity Saga (2008–2019)",
  "watched": false
}
```

`type` must be one of: `"Movie"`, `"Series"`, or `"Special"`.

---

## License

This project is open source and available under the [MIT License](LICENSE).
