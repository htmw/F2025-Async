# main.py
import json
import logging
import os
from codecs import namereplace_errors
from gzip import READ
import re

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from bson import ObjectId
from typing import Optional, List

# Import database
from database import db

from utils.geolocation import geocode_location, haversine_distance

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

def serialize_doc(doc):
    """
    Serializes a MongoDB document to a JSON-friendly format.
    """
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/artists/genre")
def get_artists_by_genre(genre: str, n: int):
    """
    Returns an array of N artists based on a genre
    """
    artists = db.artists.find({"genre": genre.lower()}).limit(n)
    output_list = [serialize_doc(artist) for artist in artists]
    return {"results": output_list}


@app.get("/artists/location")
def get_artists_by_genre_location(genre: str, location: str, n: int):
    """
    Returns an array of N artists based on a genre and city
    """
    artists = db.artists.find({
        "genre": genre.lower(),
        "location": {"$regex": location, "$options": "i"}
    }).limit(n)
    output_list = [serialize_doc(artist) for artist in artists]
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


@app.get("/local/audio")
def get_audio_db():
    artists = db.artists.find().limit(200)
    return {"results": [serialize_doc(artist) for artist in artists]}


@app.get("/artists")
def get_artists(
    genre: str = None,
    country: str = None,
    city: str = None,
    location: str = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: Optional[float] = None
):
    query = {}
    if genre:
        query["genre"] = {"$regex": f"^{genre}$", "$options": "i"}

    and_query = []
    if country:
        and_query.append({"location": {"$regex": country, "$options": "i"}})
    if city:
        and_query.append({"location": {"$regex": city, "$options": "i"}})
    if location:
        and_query.append({"location": {"$regex": location, "$options": "i"}})

    if and_query:
        query["$and"] = and_query


    use_radius_filtering = radius is not None and radius > 0
    search_lat = latitude
    search_lon = longitude

    if use_radius_filtering and (latitude is None or longitude is None) and location:
        coords = geocode_location(location)
        if coords:
            search_lat, search_lon = coords
            logger.info(f"Geocoded '{location}' to ({search_lat}, {search_lon})")
        else:
            logger.warning(f"Could not geocode location '{location}', falling back to string matching")
            use_radius_filtering = False

    if use_radius_filtering and (search_lat is None or search_lon is None):
        use_radius_filtering = False

    if not use_radius_filtering:
        and_query = []
        if country:
            and_query.append({"location": {"$regex": country, "$options": "i"}})
        if city:
            and_query.append({"location": {"$regex": city, "$options": "i"}})
        if location:
            and_query.append({"location": {"$regex": location, "$options": "i"}})

        if and_query:
            query["$and"] = and_query

    artists = db.artists.find(query)
    all_artists = [serialize_doc(artist) for artist in artists]

    if use_radius_filtering:
        results = []
        for artist in all_artists:
            coords = artist.get("coordinates")
            if coords and "latitude" in coords and "longitude" in coords:
                artist_lat = coords["latitude"]
                artist_lon = coords["longitude"]
                distance = haversine_distance(search_lat, search_lon, artist_lat, artist_lon)
                if distance <= radius:
                    artist["distance_mi"] = round(distance, 2)
                    results.append(artist)
            else:
                artist_location = artist.get("location", "")
                if location and location.lower() in artist_location.lower():
                    results.append(artist)

        results.sort(key=lambda x: x.get("distance_mi", float("inf")))
    else:
        results = all_artists

    if not results and location is not None:
        raise HTTPException(
            status_code=404, detail=f"Location '{location}' not found."
        )

    return {"results": results}


@app.get("/artists/{name}")
def get_artist_info(name: str = None):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")

    artist = db.artists.find_one({"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}})

    if artist:
        return serialize_doc(artist)

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")


@app.get("/artists/{name}/description")
def get_artist_description(name: str):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")

    artist = db.artists.find_one({"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}})

    if artist:
        return {"summary": artist.get("summary", "No summary available")}

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")


@app.get("/artists/{name}/image")
def get_artist_image(name: str):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")

    artist = db.artists.find_one({"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}})

    if artist:
        return {"image": artist.get("image", None)}

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")


@app.get("/artists/{name}/albums")
def get_artist_albums(name: str):
    if name is None:
        raise HTTPException(status_code=400, detail=f"A name was not provided!")

    artist = db.artists.find_one({"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}})

    if artist:
        return {"albums": artist.get("albums", [])}

    raise HTTPException(status_code=404, detail=f"No artist found with name '{name}'!")


@app.get("/albums/{title}/description")
def get_album_description(title: str):
    if title is None:
        raise HTTPException(status_code=400, detail=f"An album title was not provided!")

    artist = db.artists.find_one({"albums.title": {"$regex": f"^{re.escape(title)}$", "$options": "i"}})

    if artist:
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
    """
    try:
        client = CloudServiceClient()
        params = {}
        if genre:
            params["genre"] = genre
        if country:
            params["country"] = country
        if city:
            params["city"] = city
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


class RegisteredArtist(BaseModel):
    genre: str
    name: str
    location: str
    summary: Optional[str] = None
    image: Optional[str] = None


@app.post("/artists/register")
async def register_artist(artist: RegisteredArtist):
    """register your own artist profile and write to our database"""
    normalized_input = {
        "genre": artist.genre.strip().lower(),
        "name": artist.name.strip(),
        "location": artist.location.strip(),
        "summary": artist.summary.strip() if artist.summary else None,
        "image": artist.image.strip() if artist.image else None,
        "albums": []
    }

    existing_artist = db.artists.find_one({"name": {"$regex": f"^{re.escape(normalized_input['name'])}$", "$options": "i"}})
    if existing_artist:
        raise HTTPException(
            status_code=409, detail=f"Artist '{artist.name}' already exists in our data"
        )

    result = db.artists.insert_one(normalized_input)
    new_artist = db.artists.find_one({"_id": result.inserted_id})

    return {"message": "Artist registered successfully", "artist": serialize_doc(new_artist)}


class RegisteredTrack(BaseModel):
    title: str
    duration: str


class RegisteredDiscography(BaseModel):
    title: str
    year: str
    image: Optional[str] = None
    tracks: Optional[List[RegisteredTrack]] = None

@app.post("/artists/register/discography")
def register_artist_discography(
    discography: List[RegisteredDiscography],
    artist_name: Optional[str] = None
):
    if not artist_name:
        raise HTTPException(status_code=400, detail="Artist name is required")

    albums_to_add = [album.dict() for album in discography]

    result = db.artists.update_one(
        {"name": {"$regex": f"^{re.escape(artist_name)}$", "$options": "i"}},
        {"$push": {"albums": {"$each": albums_to_add}}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404, detail=f"Artist '{artist_name}' not found"
        )

    return {
        "message": f"Successfully added {len(albums_to_add)} albums",
        "artist": artist_name
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
