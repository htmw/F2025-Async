# main.py
import uvicorn
import json
from fastapi import FastAPI
from typing import Optional
from services.process_music_data import process_music_data

# TODO make something cleaner for Sprint 2
file = open('data-backend/resources/music_data_new.json', 'r')
global_music_data = json.load(file)

# Create the FastAPI app instance
app = FastAPI(
    title="Curated For You, By You API",
    description="Simple backend requests",
    version="1.0.0",
)

@app.get("/artists/genre")
def get_artists_by_genre(genre: str, n: int):
    """
    Returns an array of N artists based on a genre

    Parameters
    ----------
    genre : str
        An allowed genre that's searchable.
    n : int
        The second of artists to return if possible.
    Returns
    -------
    list
        An array of N artists or
        an array of < N artists or
        an array of zero artists
    """
    key = genre.lower()
    artists_of_genre = global_music_data[key]

    output_list = []
    for i in range(len(artists_of_genre)):
        if i >= n:
            break
        output_list.append(artists_of_genre[i])
        

    return output_list

@app.get("/artists/city")
def get_artists_by_genre_city(genre: str, city: str, n: int):
    """
    Returns an array of N artists based on a genre and city

    Parameters
    ----------
    genre : str
        An allowed genre that's searchable.
    city : str
        An allowed city
    n : int
        The second of artists to return if possible.
    Returns
    -------
    list
        An array of N artists or
        an array of < N artists or
        an array of zero artists
    """
    search_genre = genre.lower()
    search_city = city.lower()

    artists_of_genre = global_music_data[search_genre]
    artists_of_city = []

    for i in range(len(artists_of_genre)):
        if artists_of_genre[i]["city"].lower() == search_city:
            artists_of_city.append(artists_of_genre[i]) 

    output_list = []
    for i in range(len(artists_of_city)):
        if i >= n:
            break
        output_list.append(artists_of_city[i])
        

    return output_list

@app.get("/")
def get_root():
    return {"capturedHello": "capturedWorld"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)