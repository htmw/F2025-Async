import requests
from models.input_query import InputQuery

# TODO Make a class to encapsulate different backend sources so theyre not hardcoded into service files
BASE_URL = "https://musicbrainz.org/ws/2"

def search_artists(search_query, limit=100):
    query_sections = []
    query_sections.append(f"tag:{search_query.genre}")
    query_sections.append(f'area:"{search_query.city}"') 
    query_sections.append(f"country:{search_query.country}") 
    
    query = " AND ".join(query_sections)

    url = f"{BASE_URL}/artist"
    params = {
        "query": query,
        "fmt": "json",
        "limit": limit
    }
    response = requests.get(url, params=params,
                            headers={"User-Agent": "MyMusicApp/0.1 ( myemail@example.com )"})
    response.raise_for_status()
    return response.json()

# Music Brainz JSON output has some nested fields so check if theyre null or not and add to format string
def format_artist_output(artist: dict, query: InputQuery):
    name = artist.get("name", "Unknown")
    country = artist.get("country", "Unknown")

    city = artist.get("begin-area", {}).get("name") or artist.get("area", {}).get("name", "Unknown city")

    genres = [g["name"] for g in artist.get("genres", []) if g["name"].lower() == query.genre.lower()]
    if not genres:
        genres = [t["name"] for t in artist.get("tags", []) if t["name"].lower() == query.genre.lower()]

    genre_str = ", ".join(genres) if genres else "Unknown genre"
    return f"{name} ({country}) ({city}) ({genre_str})"

# TODO GET RID OF THIS MAIN FUNCTION
# just here for testing
if __name__ == "__main__":
    myquery = InputQuery("metal", "US", "")
    data = search_artists(myquery)
    for artist in data.get("artists", []):
        print(format_artist_output(artist, myquery))
