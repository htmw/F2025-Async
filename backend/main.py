# main.py
from codecs import namereplace_errors
from gzip import READ
import json
import logging
import os
from pydantic import BaseModel
from pydantic import field_validator

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Import cloud service client
from services.cloud_service_client import (
    CloudServiceAuthenticationError,
    CloudServiceClient,
    CloudServiceConnectionError,
    CloudServiceError,
    CloudServiceTimeoutError,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# TODO make something cleaner for Sprint 2
file_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "resources",
    "audioDB_200_test.json",
)
with open(file_path, "r", encoding="utf-8") as file:
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
    "http://localhost:8080",
    "http://localhost:5173",
]

""" #ip whitelist

ALLOWED_IPS = [

    "108.4.250.32" #pete's ip

]
 """
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

""" @app.middleware("http")
async def ip_whitelist_middleware(request: Request, call_next):
    #get client ip
    client_ip = request.client.host

    #check if ip is in ALLOWED_IPS
    if client_ip not in ALLOWED_IPS:
        raise HTTPException(status_code=403, detail=f"IP {client_ip} has not been whitelisted")

    #if ip is whitelisted, the request will continue
    return await call_next(request)
    return response """


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

    output_list = artists_of_genre[:n]
    return {"results": output_list}


@app.get("/artists/location")
def get_artists_by_genre_city(genre: str, city: str, n: int):
    """
    Returns an array of N artists based on a genre and city

    Parameters
    ----------
    genre : str
        An allowed genre that's searchable.
    location : str
        An location city
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
    search_city = location.lower()

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

    output_list = artists_of_city[:n]
    return {"results": output_list}


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
            "docs": "/docs",
        },
    }


"""
Get a list of artists by location and genre
    Parameters
    ----------
    genre : str
        An allowed genre that's searchable.
    location : str
        The country and city an artist is potentially from
    Returns
    -------
    list
        An array of artists
"""

### Onion Archeticture
##
# Front End (IN Public internet ) View (How the data is displayed on the screen)
#   ^
#   |
# MiddleWare (Gives Data to Front End) Controller (Where the data goes)
#   ^
#   |
# Backend (Stores Data) (DATA) Models | Brain is here with Pete
#   ^
# ###

@app.get("/local/audio")
def get_audio_db():
    return global_music_data


@app.get("/artists")
def get_artists(genre: str = None, country: str = None, city: str = None, location: str = None):
    artists_to_search = []
    if genre:
        key = genre.lower()
        if key not in global_music_data:
            raise HTTPException(status_code=404, detail=f"Genre '{genre}' not found.")
        artists_to_search = global_music_data[key]
    else:
        for artists in global_music_data.values():
            artists_to_search.extend(artists)

    filtered_output = artists_to_search
    if country:
        filtered_output = [
            artist for artist in filtered_output if artist.get("country", "").lower() == country.lower()
        ]

    if city:
        filtered_output = [
            artist for artist in filtered_output if artist.get("city", "").lower() == city.lower()
        ]

    if location:
        location_lower = location.lower()
        filtered_output = [
            artist for artist in filtered_output if artist.get("location", "").lower() == location_lower
        ]
        if not filtered_output and location is not None:
            raise HTTPException(status_code=404, detail=f"Location '{location}' not found.")

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
            "location": "United States Long Branch",
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

    raise HTTPException(
        status_code=404, detail=f"No album title found with name '{title}'!"
    )


@app.get("/cloud/artists")
async def get_cloud_artists(genre: str = None, country: str = None, city: str = None):
    """
    Example endpoint that fetches artist data from the cloud service.

    This demonstrates integration with the external cloud service API.

    Query Parameters:
        genre: Filter by genre (optional)
        country: Filter by country (optional)
        city: Filter by city (optional)

    Returns:
        JSON response with cloud service data
    """
    try:
        # Create cloud service client
        client = CloudServiceClient()

        # Build query parameters
        params = {}
        if genre:
            params["genre"] = genre
        if country:
            params["country"] = country
        if city:
            params["city"] = city

        # Make request to cloud service
        logger.info(f"Fetching artists from cloud service with params: {params}")
        data = client.get("/artists", params=params)

        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "source": "cloud_service",
                "data": data,
                "message": "Successfully retrieved data from cloud service",
            },
        )

    except CloudServiceAuthenticationError as e:
        # Log error for monitoring
        logger.error(f"ERROR: Authentication failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=401,
            detail="Failed to authenticate with cloud service. Check configuration.",
        )

    except CloudServiceTimeoutError as e:
        logger.error(f"ERROR: Request timeout: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=504,
            detail="Cloud service request timed out. Please try again later.",
        )

    except CloudServiceConnectionError as e:
        logger.error(f"ERROR: Connection failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to cloud service. Please try again later.",
        )

    except CloudServiceError as e:
        logger.error(f"ERROR: Cloud service error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=502, detail=f"Error communicating with cloud service: {str(e)}"
        )

    except Exception as e:
        logger.error(f"ERROR: Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

#schema for artists to register
class RegisteredArtist(BaseModel):
    genre: str
    name: str
    location: str
    summary: str or None
    image: str or None

@app.post("/artists/register")
async def register_artist(artist: RegisteredArtist):
    """ register your own artist profile and write to our .json file"""
    normalized_input = {
        "name": artist.name.strip(),
        "location": artist.location.strip(),
        "summary": artist.summary.strip() if artist.summary else None,
        "image": artist.image.strip() if artist.image else None
    }
    #read in audioDB_200_in_order.json
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    #normalize inputted genre to lowercase to match our keys
    genre = artist.genre.strip().lower()

    #if inputted genre is not in our file, add new genre
    if genre not in data:
        data[genre] = []

    #append the artist to the genre
    artist_name = normalized_input["name"]
    if any(existing_artist.get("name") == artist_name for existing_artist in data[genre]):
        raise HTTPException(status_code=409, detail=f"Artist '{artist.name}' already exists in our data")


    #append the artist to the genre
    data[genre].append(normalized_input)

    #write the data to the file
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

    return {"message": "Artist registered successfully", "artist": normalized_input}



if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
