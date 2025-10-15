# main.py
import uvicorn
from fastapi import FastAPI
from typing import Optional
from services.process_music_data import process_music_data

# TODO make something cleaner for Sprint 2
global_music_data = process_music_data()

# Create the FastAPI app instance
app = FastAPI(
    title="Curated For You, By You API",
    description="Simple backend requests",
    version="1.0.0",
)

@app.get("/artists")
def get_artists(genre: str, country: str, city: str):
    # TODO for now this function finds an artist if supplied all 3 arguments
    # needs to be extended to support searching without all 3
    lookup_str: str = (f"{genre};{country};{city}").lower()
    test_name = global_music_data[lookup_str]
    if test_name is None:
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"artist": test_name}

@app.get("/")
def get_artists():
    return {"capturedHello": "capturedWorld"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)