"""
Script to add latitude and longitude coordinates to artist locations in the JSON file.

This script reads the audioDB JSON file, geocodes each artist's location,
and adds a 'coordinates' field with latitude and longitude to each artist object.
"""
import json
import os
import sys
import logging
import time
from pathlib import Path

# Add parent directory to path to import utils
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.geolocation import geocode_location

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Rate limiting: delay between geocoding requests (in seconds)
GEOCODING_DELAY = 1.0  # Nominatim allows 1 request per second


def add_coordinates_to_artists(json_file_path, output_file_path=None):
    """
    Add coordinates to all artists in the JSON file.
    
    Parameters
    ----------
    json_file_path : str
        Path to the input JSON file
    output_file_path : str, optional
        Path to the output JSON file (defaults to overwriting input file)
    """
    if output_file_path is None:
        output_file_path = json_file_path
    
    logger.info(f"Loading JSON file: {json_file_path}")
    
    # Load the JSON data
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        logger.error(f"Failed to load JSON file: {e}")
        return
    
    total_artists = 0
    processed_count = 0
    skipped_count = 0
    failed_count = 0
    updated_count = 0
    failed_locations = []
    
    # Process each genre
    for genre, artists in data.items():
        logger.info(f"Processing genre: {genre} ({len(artists)} artists)")
        
        for artist_index, artist in enumerate(artists):
            total_artists += 1
            artist_name = artist.get("name", "Unknown")
            
            # Skip if coordinates already exist
            if "coordinates" in artist and artist["coordinates"]:
                logger.debug(f"Skipping {artist_name} - coordinates already exist")
                skipped_count += 1
                continue
            
            location = artist.get("location", "")
            
            if not location:
                logger.warning(f"Artist '{artist_name}' has no location field")
                failed_count += 1
                failed_locations.append(f"{artist_name}: No location field")
                continue
            
            # Geocode the location
            logger.info(f"Geocoding {artist_name} - {location} ({processed_count + 1}/{total_artists})")
            coordinates = geocode_location(location, retries=3, delay=GEOCODING_DELAY)
            
            if coordinates:
                lat, lon = coordinates
                artist["coordinates"] = {
                    "latitude": lat,
                    "longitude": lon
                }
                updated_count += 1
                logger.info(f"✓ Added coordinates for {artist_name}: ({lat}, {lon})")
            else:
                failed_count += 1
                failed_locations.append(f"{artist_name}: {location}")
                logger.warning(f"✗ Failed to geocode {artist_name} - {location}")
            
            processed_count += 1
            
            # Rate limiting delay
            time.sleep(GEOCODING_DELAY)
    
    # Save the updated JSON
    logger.info(f"Saving updated JSON to: {output_file_path}")
    try:
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info("✓ JSON file saved successfully")
    except Exception as e:
        logger.error(f"Failed to save JSON file: {e}")
        return
    
    # Print summary
    logger.info("\n" + "="*60)
    logger.info("SUMMARY")
    logger.info("="*60)
    logger.info(f"Total artists: {total_artists}")
    logger.info(f"Processed: {processed_count}")
    logger.info(f"Skipped (already processed): {skipped_count}")
    logger.info(f"Updated with coordinates: {updated_count}")
    logger.info(f"Failed to geocode: {failed_count}")
    logger.info("="*60)
    
    if failed_count > 0:
        logger.warning(f"\nFailed to geocode {failed_count} locations:")
        for failed in failed_locations:
            logger.warning(f"  - {failed}")


def main():
    """Main entry point for the script."""
    # Get the script's directory (where the JSON files are)
    script_dir = Path(__file__).parent
    json_file_path = str(script_dir / "audioDB_200_in_order.json")
    
    if not os.path.exists(json_file_path):
        logger.error(f"JSON file not found: {json_file_path}")
        sys.exit(1)
    
    output_file_path = sys.argv[1] if len(sys.argv) > 1 else None
    if output_file_path and not os.path.isabs(output_file_path):
        output_file_path = str(script_dir / output_file_path)
    
    logger.info("Starting coordinate addition process...")
    logger.info(f"Input file: {json_file_path}")
    if output_file_path:
        logger.info(f"Output file: {output_file_path}")
    
    add_coordinates_to_artists(json_file_path, output_file_path)
    
    logger.info("\nProcess completed!")


if __name__ == "__main__":
    main()

