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

# @app.get("/artists")
# def get_artists(genre: str, city: str, country: str):
#     # TODO for me and Pete
#     # do something with global_music_data
#     return {"dummy": "dummy"}

@app.get("/")
def read_root():
    return {"Hello": "World"};

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)