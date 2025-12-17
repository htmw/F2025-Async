import json
from database import db

def seed_database():
    """
    Seeds the MongoDB database with data from the JSON file.
    """
    artists_collection = db.artists
    
    # Clear existing data to avoid duplicates on re-running
    print("Clearing existing artist data...")
    artists_collection.delete_many({})
    
    print("Reading data from JSON file...")
    try:
        with open('resources/audioDB_200_test.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: audioDB_200_test.json not found. Make sure the file is in the 'resources' directory.")
        return
    
    all_artists = []
    for genre, artists_in_genre in data.items():
        for artist in artists_in_genre:
            artist_document = artist.copy()
            artist_document['genre'] = genre
            all_artists.append(artist_document)
            
    if all_artists:
        print(f"Inserting {len(all_artists)} artists into the database...")
        artists_collection.insert_many(all_artists)
        print(f"Successfully seeded {artists_collection.count_documents({})} artists into the database.")
    else:
        print("No artists found in the JSON file to seed.")

if __name__ == "__main__":
    seed_database()
