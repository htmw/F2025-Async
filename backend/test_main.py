import pytest
from fastapi.testclient import TestClient

# Assuming pytest is run from the project root, which is the parent of 'backend'
from backend.main import app

client = TestClient(app)


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


def test_get_artists_by_country_and_city():
    """Happy Path: Tests filtering artists by country and city."""
    response = client.get("/artists?country=United States&city=Long Branch")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0
    for artist in data["results"]:
        assert artist["country"].lower() == "united states"
        assert artist["city"].lower() == "long branch"


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
