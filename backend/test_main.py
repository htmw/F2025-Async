import json
import os

import pytest
from fastapi.testclient import TestClient

# Assuming pytest is run from the project root, which is the parent of 'backend'
from main import app, db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_teardown():
    """Fixture to clear the database before and after each test."""
    db.artists.delete_many({})
    yield
    db.artists.delete_many({})


def test_get_root():
    """Tests the root endpoint to ensure it returns the API information."""
    response = client.get("/")
    assert response.status_code == 200
    expected_json = {
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
    assert response.json() == expected_json


# Tests for the /artists endpoint
def test_get_artists_no_filters():
    """Happy Path: Tests fetching all artists without any filters."""
    db.artists.insert_one({"name": "Test Artist", "genre": "rock"})
    response = client.get("/artists")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) > 0


def test_get_artists_by_valid_genre():
    """Happy Path: Tests filtering artists by a valid genre."""
    db.artists.insert_one({"name": "Artist 1", "genre": "rock"})
    db.artists.insert_one({"name": "Artist 2", "genre": "pop"})
    response = client.get("/artists?genre=rock")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 1
    assert data["results"][0]["name"] == "Artist 1"


def test_get_artists_by_invalid_genre():
    """Sad Path: Tests filtering artists by an invalid genre, should return empty list."""
    response = client.get("/artists?genre=nonexistentgenre")
    assert response.status_code == 200
    assert response.json() == {"results": []}


def test_get_artists_by_location():
    """Happy Path: Tests filtering artists by location."""
    db.artists.insert_one({"name": "Artist 1", "location": "Seattle, Washington, USA"})
    response = client.get("/artists?location=Seattle")
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 1
    assert data["results"][0]["name"] == "Artist 1"


def test_get_artists_by_invalid_location():
    """Sad Path: Tests filtering artists by an invalid location."""
    response = client.get("/artists?location=nonexistentcity")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Location 'nonexistentcity' not found."
    }


def test_get_artists_no_results_found():
    """Happy Path: Tests a valid filter combination that returns no results."""
    response = client.get("/artists?genre=rock&country=nonexistentcountry")
    assert response.status_code == 200
    assert response.json() == {"results": []}


# Tests for /artists/{name}
def test_get_artist_info_happy_path():
    """Happy Path: Tests fetching a specific artist by name."""
    db.artists.insert_one({"name": "Bruce Springsteen", "summary": "A summary", "albums": []})
    response = client.get("/artists/Bruce Springsteen")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Bruce Springsteen"
    assert "summary" in data
    assert "albums" in data


def test_get_artist_info_case_insensitive():
    """Happy Path: Tests that artist name matching is case-insensitive."""
    db.artists.insert_one({"name": "Bruce Springsteen"})
    response = client.get("/artists/bruce springsteen")
    assert response.status_code == 200
    assert response.json()["name"] == "Bruce Springsteen"


def test_get_artist_info_not_found():
    """Sad Path: Tests fetching an artist that does not exist."""
    response = client.get("/artists/NonExistent Artist")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "No artist found with name 'NonExistent Artist'!"
    }


# Tests for /artists/{name}/description
def test_get_artist_description_happy_path():
    """Happy Path: Tests fetching the description of a specific artist."""
    db.artists.insert_one({"name": "Bruce Springsteen", "summary": "A summary"})
    response = client.get("/artists/Bruce Springsteen/description")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert isinstance(data["summary"], str)


def test_get_artist_description_not_found():
    """Sad Path: Tests fetching the description of a non-existent artist."""
    response = client.get("/artists/NonExistent Artist/description")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "No artist found with name 'NonExistent Artist'!"
    }


# Tests for /artists/{name}/image
def test_get_artist_image_happy_path():
    """Happy Path: Tests fetching the image URL of a specific artist."""
    db.artists.insert_one({"name": "Bruce Springsteen", "image": "http://example.com/image.jpg"})
    response = client.get("/artists/Bruce Springsteen/image")
    assert response.status_code == 200
    data = response.json()
    assert "image" in data
    assert data["image"].startswith("http")


def test_get_artist_image_not_found():
    """Sad Path: Tests fetching the image URL of a non-existent artist."""
    response = client.get("/artists/NonExistent Artist/image")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "No artist found with name 'NonExistent Artist'!"
    }


# Tests for /artists/{name}/albums
def test_get_artist_albums_happy_path():
    """Happy Path: Tests fetching albums for a specific artist."""
    db.artists.insert_one({"name": "Bruce Springsteen", "albums": [{"title": "Born to Run"}]})
    response = client.get("/artists/Bruce Springsteen/albums")
    assert response.status_code == 200
    data = response.json()
    assert "albums" in data
    assert isinstance(data["albums"], list)
    assert len(data["albums"]) > 0
    assert any(album["title"] == "Born to Run" for album in data["albums"])


def test_get_artist_albums_not_found():
    """Sad Path: Tests fetching albums for a non-existent artist."""
    response = client.get("/artists/NonExistent Artist/albums")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "No artist found with name 'NonExistent Artist'!"
    }


# Tests for /albums/{title}/description
def test_get_album_description_happy_path():
    """Happy Path: Tests fetching information for a specific album by title."""
    db.artists.insert_one({"name": "Bruce Springsteen", "albums": [{"title": "Born to Run", "year": 1975, "tracks": []}]})
    response = client.get("/albums/Born to Run/description")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Born to Run"
    assert "year" in data
    assert "tracks" in data


def test_get_album_description_case_insensitive():
    """Happy Path: Tests that album title matching is case-insensitive."""
    db.artists.insert_one({"name": "Bruce Springsteen", "albums": [{"title": "Born to Run", "year": 1975, "tracks": []}]})
    response = client.get("/albums/born to run/description")
    assert response.status_code == 200
    assert response.json()["title"] == "Born to Run"


def test_get_album_description_not_found():
    """Sad Path: Tests fetching an album that does not exist."""
    response = client.get("/albums/NonExistent Album/description")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "No album title found with name 'NonExistent Album'!"
    }


def test_register_artist_passes():
    """Happy Path: Tests that the post end point passes without error."""
    test_artist = {
        "genre": "rock",
        "name": "Test Artist",
        "location": "Test City",
        "summary": "Test artist summary",
        "image": "http://example.com/image.jpg",
    }
    response = client.post("/artists/register", json=test_artist)
    assert response.status_code == 200
    artist_in_db = db.artists.find_one({"name": "Test Artist"})
    assert artist_in_db is not None
    assert artist_in_db["location"] == "Test City"


def test_register_artist_duplicate_fails():
    """Sad Path: Tests that registering a duplicate artist fails."""
    test_artist = {
        "genre": "rock",
        "name": "Test Artist",
        "location": "Test City",
        "summary": "Test artist summary",
        "image": "http://example.com/image.jpg",
    }
    client.post("/artists/register", json=test_artist)
    response = client.post("/artists/register", json=test_artist)
    assert response.status_code == 409
    assert response.json() == {
        "detail": "Artist 'Test Artist' already exists in our data"
    }


def test_register_discography():
    """Happy Path: Tests that the post end point passes without error and updates the JSON database with a new discography entry."""
    db.artists.insert_one({"name": "Vaporwave Guy", "genre": "vaporwave", "albums": []})
    test_discography = {
        "title": "Vaporwave Vol. 1",
        "year": "1999",
        "image": "https://r2.theaudiodb.com/images/media/album/thumb/hjy4lj1642529894.jpg",
        "rating": None,
        "tracks": [
            {"title": "Vapors", "duration": "3:30"},
        ],
    }

    response = client.post(
        "/artists/register/discography?artist_name=Vaporwave Guy",
        json=test_discography,
    )
    assert response.status_code == 200
    
    artist = db.artists.find_one({"name": "Vaporwave Guy"})
    assert len(artist["albums"]) == 1
    assert artist["albums"][0]["title"] == "Vaporwave Vol. 1"


def test_register_discography_artist_not_found():
    """Sad Path: Tests that the post end point errors when the artist name is missing."""
    test_discography = {
        "title": "Vaporwave Vol. 2",
        "year": "1999",
        "image": "https://r2.theaudiodb.com/images/media/album/thumb/hjy4lj1642529894.jpg",
        "rating": None,
        "tracks": [
            {"title": "Vapors", "duration": "3:30"},
        ],
    }

    response = client.post(
        "/artists/register/discography?artist_name=NonExistent",
        json=test_discography,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Artist 'NonExistent' does not exist in our data"