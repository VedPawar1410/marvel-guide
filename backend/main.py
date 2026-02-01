"""
FastAPI backend for Marvel Movie Guide
Serves the Marvel movies and shows data from JSON file
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pathlib import Path

app = FastAPI(title="Marvel Movie Guide API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request body
class WatchedUpdate(BaseModel):
    watched: bool

# Path to the JSON data file
DATA_FILE = Path(__file__).parent / "data" / "marvel_movies.json"


def load_movies():
    """Load movies data from JSON file"""
    with open(DATA_FILE, "r") as f:
        return json.load(f)


@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Marvel Movie Guide API"}


@app.get("/api/movies")
def get_movies():
    """Get all Marvel movies and shows"""
    movies = load_movies()
    return {"movies": movies}


@app.patch("/api/movies/{movie_id}/watched")
def update_watched(movie_id: int, update: WatchedUpdate):
    """Update watched status for a movie"""
    movies = load_movies()
    
    # Find and update the movie
    for movie in movies:
        if movie["id"] == movie_id:
            movie["watched"] = update.watched
            break
    
    # Save back to file
    with open(DATA_FILE, "w") as f:
        json.dump(movies, f, indent=2)
    
    return {"success": True, "movie_id": movie_id, "watched": update.watched}
