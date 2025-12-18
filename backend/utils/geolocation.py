"""
Geolocation utility functions for geocoding and distance calculations.
"""
import logging
from typing import Optional, Tuple
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError, GeocoderUnavailable
import time

logger = logging.getLogger(__name__)

# Initialize geocoder with a user agent
_geocoder = None


def _get_geocoder():
    """Get or create the geocoder instance."""
    global _geocoder
    if _geocoder is None:
        _geocoder = Nominatim(user_agent="cfyby-artist-search")
    return _geocoder


def geocode_location(location_string: str, retries: int = 3, delay: float = 1.0) -> Optional[Tuple[float, float]]:
    """
    Convert a location string to latitude and longitude coordinates.
    
    Parameters
    ----------
    location_string : str
        Location string to geocode (e.g., "Seattle, Washington, USA")
    retries : int
        Number of retry attempts on failure
    delay : float
        Delay in seconds between retries
        
    Returns
    -------
    tuple[float, float] | None
        Tuple of (latitude, longitude) if successful, None otherwise
    """
    if not location_string or not location_string.strip():
        logger.warning(f"Empty location string provided")
        return None
    
    geocoder = _get_geocoder()
    
    for attempt in range(retries):
        try:
            # Add delay to respect rate limits (except first attempt)
            if attempt > 0:
                time.sleep(delay * attempt)
            
            location = geocoder.geocode(location_string, timeout=10)
            
            if location:
                return (location.latitude, location.longitude)
            else:
                logger.warning(f"Could not geocode location: '{location_string}'")
                return None
                
        except GeocoderTimedOut:
            logger.warning(f"Geocoding timeout for '{location_string}' (attempt {attempt + 1}/{retries})")
            if attempt == retries - 1:
                logger.error(f"Failed to geocode '{location_string}' after {retries} attempts")
                return None
                
        except (GeocoderServiceError, GeocoderUnavailable) as e:
            logger.error(f"Geocoding service error for '{location_string}': {e}")
            return None
            
        except Exception as e:
            logger.error(f"Unexpected error geocoding '{location_string}': {e}")
            return None
    
    return None


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
THE HAVERSINE FORMULA!!!!!!!!!!!!!!

creds to @SecretNation 
    """
    import math
    
    R = 3958.8
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    

    a = (
        math.sin(delta_phi / 2) ** 2 +
        math.cos(phi1) * math.cos(phi2) *
        math.sin(delta_lambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    

    distance = R * c
    
    return distance

