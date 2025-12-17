import json
import os
from tkinter.constants import N

import pytest
from fastapi.testclient import TestClient

# Assuming pytest is run from the project root, which is the parent of 'backend'
from backend.main import app

client = TestClient(app)

file_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)),
    "resources",
    "audioDB_200_test.json",
)


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
    response = client.get("/artists")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert isinstance(data["results"], list)
    # This assumes the data file is not empty
    assert len(data["results"]) > 0


def test_get_artists_by_valid_genre():
    """Happy Path: Tests filtering artists by a valid genre."""
    response = client.get("/artists?genre=rock")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0


def test_get_artists_by_invalid_genre():
    """Sad Path: Tests filtering artists by an invalid genre."""
    response = client.get("/artists?genre=nonexistentgenre")
    assert response.status_code == 404
    assert response.json() == {"detail": "Genre 'nonexistentgenre' not found."}


def test_get_artists_by_location():
    """Happy Path: Tests filtering artists by location."""
    response = client.get("/artists?location=Seattle, Washington, USA")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0
    assert "Seattle, Washington, USA" in data["results"][0]["location"]


def test_get_artists_by_invalid_location():
    """Sad Path: Tests filtering artists by an invalid location."""
    response = client.get("/artists?location=nonexistentcity, nonexistentcountry")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Location 'nonexistentcity, nonexistentcountry' not found."
    }


def test_get_artists_no_results_found():
    """Happy Path: Tests a valid filter combination that returns no results."""
    response = client.get("/artists?genre=rock&country=nonexistentcountry")
    assert response.status_code == 200
    assert response.json() == {"results": []}


# Tests for /artists/{name}
def test_get_artist_info_happy_path():
    """Happy Path: Tests fetching a specific artist by name."""
    response = client.get("/artists/Bruce Springsteen")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Bruce Springsteen"
    assert "summary" in data
    assert "albums" in data


def test_get_artist_info_case_insensitive():
    """Happy Path: Tests that artist name matching is case-insensitive."""
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
    response = client.get("/artists/Bruce Springsteen/albums")
    assert response.status_code == 200
    data = response.json()
    assert "albums" in data
    assert isinstance(data["albums"], list)
    assert len(data["albums"]) > 0
    # Assuming "Born to Run" is in the test data for Bruce Springsteen
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
    response = client.get("/albums/Born to Run/description")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Born to Run"
    assert "year" in data
    assert "tracks" in data


def test_get_album_description_case_insensitive():
    """Happy Path: Tests that album title matching is case-insensitive."""
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


def test_register_artist_existing_genre_json_updates():
    """Happy Path: Tests that the post end point passes without error and updates the JSON database with a new artist."""
    test_artist = {
        "genre": "rock",
        "name": "Test Artist1",
        "location": "Test City",
        "summary": "Test artist summary",
        "image": "http://example.com/image.jpg",
    }

    response = client.post("/artists/register", json=test_artist)

    # read in audioDB_200_in_order.json
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    assert response.status_code == 200


def test_register_artist_new_genre_json_updates():
    """Happy Path: Tests that the post end point passes without error and updates the JSON database with a new genre and artist entry."""
    test_artist = {
        "genre": "vaporwave",
        "name": "Guy Who Does Vaporwave",
        "location": "Miami",
        "summary": "His summary",
        "image": "http://example.com/image.jpg",
    }

    response = client.post("/artists/register", json=test_artist)
    # read in audioDB_200_in_order.json
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    assert response.status_code == 200
    assert "vaporwave" in data
    assert any(
        artist.get("name") == "Guy Who Does Vaporwave" for artist in data["vaporwave"]
    )


def test_register_artist_new_genre_json_updates_assert_if_duplicate_exists():
    f"""Sad Path: Tests that the post end point passes without error and updates the JSON database with a new genre and artist entry."""
    test_artist = {
        "genre": "vaporwave",
        "name": "Guy Who Does Vaporwave",
        "location": "Miami",
        "summary": "His summary",
        "image": "http://example.com/image.jpg",
    }

    response = client.post("/artists/register", json=test_artist)
    assert response.status_code == 409
    assert response.json() == {
        "detail": "Artist 'Guy Who Does Vaporwave' already exists in our data"
    }


@pytest.fixture
def setup_discography_test():
    # Before each test, read the original content of the file
    with open(file_path, "r", encoding="utf-8") as f:
        original_content = f.read()

    # Register a test artist
    test_artist = {
        "genre": "vaporwave",
        "name": "Guy Who Does Vaporwave",
        "location": "Miami",
        "summary": "His summary",
        "image": "http://example.com/image.jpg",
    }
    client.post("/artists/register", json=test_artist)

    yield

    # After each test, write the original content back to the file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(original_content)


def test_register_discography(setup_discography_test):
    """Happy Path: Tests that the post end point passes without error and updates the JSON database with a new discography entry."""
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
        "/artists/register/discography?artist_name=Guy Who Does Vaporwave",
        json=test_discography,
    )

    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    assert response.status_code == 200
    assert "vaporwave" in data
    assert any(
        album.get("title") == "Vaporwave Vol. 1"
        for artist in data["vaporwave"]
        for album in artist.get("albums", [])
    )


def test_register_discography_should_error():
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
        "/artists/register/discography",
        json=test_discography,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Artist name is required"
