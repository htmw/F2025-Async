import csv
import json
from operator import ge
from uuid import UUID
from webbrowser import get


def process_music_data(
    filename="data-backend/resources/musicbrainz_pull_clean_more_data.csv",
):
    """
    Processes a CSV file of music data, filtering and storing unique artists.

    Args:
        filename (str): The name of the CSV file to process.

    Returns:
        dict: A dictionary containing the processed music data,
              with artist names as keys.
    """
    allowed_genres = {
        "rock",
        "pop",
        "jazz",
        "hip hop",
        "techno",
        "classical",
        "country",
    }
    music_data = {}
    infolist = []

    try:
        with open(filename, "r", encoding="utf-8") as csvfile:
            # Try to determine the delimiter
            sniffer = csv.Sniffer()
            try:
                dialect = sniffer.sniff(csvfile.read(1024))
                csvfile.seek(0)
            except csv.Error:
                # If sniffer fails, assume comma delimiter
                dialect = "excel"

            reader = csv.DictReader(csvfile, dialect=dialect)
            for row in reader:
                name = row.get("name")
                genre = row.get("tag")
                country = row.get("area_name")
                city = row.get("begin_area_name")

                if genre not in allowed_genres:
                    continue

                if name:
                    infolist.append(
                        {
                            "name": name,
                            "country": country,
                            "city": city,
                        }
                    )

                if tag in allowed_tags:
                    if country and city:
                        music_data[genre] = music_data.get(tag, [])
                        music_data[genre].append(infolist[-1])

    except FileNotFoundError:
        print(f"Error: The file {filename} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

    return music_data


def create_json_file(music_data, json_filename="../resources/music_data_new.json"):
    """
    Creates a JSON file from the given music data.

    Args:
        music_data (dict): The dictionary containing music data.
        json_filename (str): The name of the JSON file to create.
    """
    try:
        with open(json_filename, "w", encoding="utf-8") as jsonfile:
            json.dump(music_data, jsonfile, indent=4)
        print(f"Successfully created {json_filename}")
    except Exception as e:
        print(f"An error occurred while creating the JSON file: {e}")


def get_unique_locations(json_filename="../resources/audioDB_200_in_order.json"):
    try:
        with open(json_filename, "r", encoding="utf-8") as jsonfile:
            data = json.load(jsonfile)
        unique_locations = set()
        for band_list in data.values():
            for band_data in band_list:
                unique_locations.add(band_data.get("location"))
        return sorted(list(unique_locations))
    except FileNotFoundError:
        print(f"Error: The file {json_filename} was not found.")
    except Exception as e:
        print(f"An error occurred while reading the JSON file: {e}")


def get_unique_genres(json_filename="../resources/audioDB_200_in_order.json"):
    try:
        with open(json_filename, "r", encoding="utf-8") as jsonfile:
            data = json.load(jsonfile)
        unique_genres = set()
        for genres in data:
            unique_genres.add(genres)
        return sorted(list(unique_genres))
    except FileNotFoundError:
        print(f"Error: The file {json_filename} was not found.")
    except Exception as e:
        print(f"An error occurred while reading the JSON file: {e}")


if __name__ == "__main__":
    #    unique_locations = get_unique_locations()
    #    print(f"Unique locations: {unique_locations}")
    get_unique_genres()
    print(f"Unique genres: {get_unique_genres()}")
    # processed_data = process_music_data()
    # create_json_file(processed_data)
    # # Optional: print the number of unique artists found
    # print(f"Found {len(processed_data)} unique artists with the specified tags.")
    # # Optional: print the first 5 items for verification
    # count = 0
    # for name, data in processed_data.items():
    #     if count < 5:
    #         print(f"{name}: {data}")
    #         count += 1
    #     else:
    #         break
