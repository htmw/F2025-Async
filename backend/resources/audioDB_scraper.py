import aiohttp
import asyncio
import json

# --- CONFIGURATION ---
API_KEY = 715619 
START_ID = 111233                 # this is the lowest value for artist id for some reason 
MAX_ARTISTS = 333                 # find 200 artists please
OUTPUT_FILE = "audioDB_200_in_order.json"

BASE_URL = f"https://www.theaudiodb.com/api/v1/json/{API_KEY}"

async def fetch_json(session, url, retries=3):
    """helper function to fetch JSON from a URL with error handling and retry logic."""
    for attempt in range(retries):
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    try:
                        return await response.json()
                    except json.JSONDecodeError:
                        return None
                elif response.status == 429:
                    # rate limit throttling, wait and retry situation
                    wait_time = (attempt + 1) * 2  # pause for 2s, 4s, 6s give up after
                    print(f"rate limit hit (429), waiting {wait_time}s before retry {attempt + 1}/{retries}...")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    print(f"error {response.status} fetching {url}")
                    return None
        except Exception as e:
            print(f"request failed: {e}")
            if attempt < retries - 1:
                await asyncio.sleep(1)
                continue
            return None
    
    print(f"failed after {retries} retries")
    return None

def milliseconds_to_duration(milliseconds):
    """milisecond to m:ss converter"""
    if not milliseconds or milliseconds == 0:
        return "0:00"
    
    total_seconds = int(milliseconds) // 1000
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    
    return f"{minutes}:{seconds:02d}"

def clean_artist_data(artist_obj):
    """build artist data in exact schema order"""
    if not artist_obj:
        return None
    
    # TODO audiodb doesnt have a city field, we can use country to get city and split later
    cleaned = {
        "name": artist_obj.get("strArtist"),
        "country": artist_obj.get("strCountry"),
        "city": None,  # audiodb doesn't provide this field
        "summary": artist_obj.get("strBiographyEN"),
        "image": artist_obj.get("strArtistThumb")
    }
    
    return cleaned

async def process_artist(session, artist_id):
    """fetches artist -> albums -> tracks tree sequentially"""
    
    # fetch artist
    print(f"fetching artist ID: {artist_id}...")
    artist_data = await fetch_json(session, f"{BASE_URL}/artist.php?i={artist_id}")
    
    if not artist_data or not artist_data.get("artists"):
        return None
    
    raw_artist = artist_data["artists"][0]
    artist_profile = clean_artist_data(raw_artist)
    genre = raw_artist.get("strGenre", "Unclassified")
    
    if not genre:
        genre = "Unclassified"

    # fetch albums
    albums_data = await fetch_json(session, f"{BASE_URL}/album.php?i={artist_id}")
    artist_profile["albums"] = []

    if albums_data and albums_data.get("album"):
        # fully sequential - audiodb api doesn't like any parallelization
        for raw_album in albums_data["album"]:
            album_obj = {
                "title": raw_album.get("strAlbum"),
                "year": raw_album.get("intYearReleased"),
                "image": raw_album.get("strAlbumThumb"),
                "rating": raw_album.get("intScore"),
                "tracks": []
            }
            
            album_id = raw_album.get("idAlbum")
            if album_id:
                tracks_data = await fetch_json(session, f"{BASE_URL}/track.php?m={album_id}")
                if tracks_data and tracks_data.get("track"):
                    for raw_track in tracks_data["track"]:
                        dur = raw_track.get("intDuration")
                        duration_ms = int(dur) if dur and dur != "0" else 0
                        track_obj = {
                            "title": raw_track.get("strTrack"),
                            "duration": milliseconds_to_duration(duration_ms)
                        }
                        album_obj["tracks"].append(track_obj)
            
            artist_profile["albums"].append(album_obj)

    return genre, artist_profile

async def main():
    print(f"\n{'='*60}")
    print(f"Starting AudioDB Scraper")
    print(f"Target: {MAX_ARTISTS} valid artists")
    print(f"Starting from ID: {START_ID}")
    print(f"{'='*60}\n")
    
    all_valid_artists = []
    current_id = START_ID
    total_ids_checked = 0
    
    async with aiohttp.ClientSession() as session:
        print("Searching for valid artists...\n")
        
        # process one artist at a time until we reach target
        while len(all_valid_artists) < MAX_ARTISTS:
            try:
                result = await process_artist(session, current_id)
                
                if result:
                    all_valid_artists.append(result)
                    print(f"✓ Valid artist found! Progress: {len(all_valid_artists)}/{MAX_ARTISTS}\n")
                
                total_ids_checked += 1
                current_id += 1
                
                # im getting errors without a little time delay between artists
                await asyncio.sleep(0.5)
                
                # progress update every 50 IDs
                if total_ids_checked % 50 == 0:
                    print(f"--- Checked {total_ids_checked} IDs so far, found {len(all_valid_artists)} valid artists ---\n")
                
                # dnt search forever check
                if total_ids_checked > 20000:
                    print(f"⚠ Searched {total_ids_checked} IDs. Stopping search.")
                    break
                    
            except Exception as e:
                print(f"error processing ID {current_id}: {e}")
                current_id += 1
                total_ids_checked += 1
                continue

        # build final schema from collected artists
        print(f"\n{'='*60}")
        print(f"Building final corpus...")
        
        final_corpus = {}
        for genre, artist_data in all_valid_artists[:MAX_ARTISTS]:
            # make genre key lowercase
            genre_key = genre.lower()
            
            if genre_key not in final_corpus:
                final_corpus[genre_key] = []
            
            final_corpus[genre_key].append(artist_data)

        # save the file
        print(f"Saving data to {OUTPUT_FILE}...")
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(final_corpus, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Successfully scraped {len(all_valid_artists[:MAX_ARTISTS])} valid artists into {OUTPUT_FILE}")
        print(f"✓ Total IDs checked: {total_ids_checked}")
        print(f"✓ Success rate: {len(all_valid_artists)/total_ids_checked*100:.1f}%")
        print(f"✓ Total genres: {len(final_corpus)}")
        print(f"{'='*60}\n")

if __name__ == "__main__":
    asyncio.run(main())
