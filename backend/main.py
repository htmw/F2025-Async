# main.py
import uvicorn
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from services.process_music_data import process_music_data

# TODO make something cleaner for Sprint 2
file = open('backend/resources/expanded_schema.json', 'r')
global_music_data = json.load(file)

# Create the FastAPI app instance
app = FastAPI(
    title="Curated For You, By You API",
    description="Simple backend requests",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def get_root():
    return {
        "name": "CFYBY API",
        "version": "0.0.0",
        "status": "ok",
        "endpoints": {
            "artists": "/artists",
            "artist_by_name": "/artists/{name}",
            "artist_description": "/artists/{name}/description",
            "artist_image": "/artists/{name}/image",
            "artist_albums": "/artists/{name}/albums",
            "album_description": "/albums/{title}/description",
            "docs": "/docs"
        }
    }

"""
Get a list of artists by location and genre
    Parameters
    ----------
    genre : str
        An allowed genre that's searchable.
    country : str
        The country an artist is potentially from
    city : str
        The city an artist is potentially from
    Returns
    -------
    list
        An array of artists
"""
@app.get("/artists")
def get_artists(genre: str = None, country: str = None, city: str = None):
    # if we don't have a valid genre, we want to at least filter for artists by city and country alone, so lets just make a
    # huge list with every artist combined
    artists_to_search = []
    if genre is None:
        for artists in global_music_data.values():
            artists_to_search.extend(artists)

    else:
        key = genre.lower()
        if key not in global_music_data:
            raise HTTPException(status_code=404, detail=f"Genre '{genre}' not found.")
        artists_to_search = global_music_data[key]

    filtered_output = []
    for artist in artists_to_search:
        if country and artist["country"].lower() != country.lower():
            continue
        if city and artist["city"].lower() != city.lower():
            continue
        filtered_output.append(artist)

    return {"results": filtered_output}

"""
Get all available information for an artist
    Parameters
    ----------
    name : str
        The name of an artist
    Returns
    -------
    artist information
        {
            "name": "Bruce Springsteen",
            "country": "United States",
            "city": "Long Branch",
            "summary": "A Description of Artist",
            "image": "https://example.com/bruce-springsteen.jpg",
            "albums": [
              {
                "title": "Born to Run",
                "year": 1975,
                "image": "https://example.com/born-to-run.jpg",
                "rating": 5,
                "tracks": [
                  {
                    "title": "Jungleland",
                    "duration": 240
                  }
                ]
              }
            ]
        }
"""
@app.get("/artists/{name}")
def get_artist_info(name: str = None):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")
    
    for artists in global_music_data.values():
        for artist in artists:
            if artist.get("name", "").strip().lower() == name.strip().lower():
                return artist

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")

"""
Get a description of an artist
    Parameters
    ----------
    name : str
        The name of an artist
    Returns
    -------
    summary
        A description of an artist
"""
@app.get("/artists/{name}/description")
def get_artist_description(name: str):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")
    
    for artists in global_music_data.values():
        for artist in artists:
            if artist.get("name", "").strip().lower() == name.strip().lower():
                return {"summary": artist.get("summary", "No summary available")}

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")

"""
Get an image URL of an artist
    Parameters
    ----------
    name : str
        The name of an artist
    Returns
    -------
    image_url
        A URL to an image of the artist
"""
@app.get("/artists/{name}/image")
def get_artist_image(name: str):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")
    
    for artists in global_music_data.values():
        for artist in artists:
            if artist.get("name", "").strip().lower() == name.strip().lower():
                return {"image": artist.get("image", None)}

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")

"""
Get a list of albums by an artist
    Parameters
    ----------
    name : str
        The name of an artist
    Returns
    -------
    list
        An array of album info
    
        [
            {
                "title": "Born to Run",
                "year": 1975,
                "image": "https://example.com/born-to-run.jpg",
                "rating": 5,
                "tracks": [
                  {
                    "title": "Jungleland",
                    "duration": 240
                  }
                ]
            }
        ]
"""
@app.get("/artists/{name}/albums")
def get_artist_albums(name: str):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")
    
    for artists in global_music_data.values():
        for artist in artists:
            if artist.get("name", "").strip().lower() == name.strip().lower():
                return {"albums": artist.get("albums", [])}

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")

"""
Get all available info for an album
    Parameters
    ----------
    title : str
        The title of an album
    Returns
    -------
    album_info
        {
            "title": "Born to Run",
            "year": 1975,
            "image": "https://example.com/born-to-run.jpg",
            "rating": 5,
            "tracks": [
              {
                "title": "Jungleland",
                "duration": 240
              }
            ]
        }    
"""
@app.get("/albums/{title}/description")
def get_album_description(title: str):
    if title is None:
        raise HTTPException(status_code=400, detail=f"An album title was not provided!")
    
    for artists in global_music_data.values():
        for artist in artists:
            for album in artist.get("albums", []):
                if album.get("title", "").strip().lower() == title.strip().lower():
                    return album

    raise HTTPException(status_code=404, detail=f"No album title found with name '{title}'!")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)