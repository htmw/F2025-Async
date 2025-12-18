"""
Tests for geolocation utility functions.
"""
import pytest
from unittest.mock import Mock, patch
from geopy.exc import GeocoderTimedOut, GeocoderServiceError, GeocoderUnavailable
from utils.geolocation import geocode_location, haversine_distance


# ============================================================================
# Tests for haversine_distance()
# ============================================================================

def test_haversine_distance_same_point():
    """Happy Path: Tests that distance between identical points is zero."""
    lat, lon = 47.6062, -122.3321  # Seattle
    distance = haversine_distance(lat, lon, lat, lon)
    assert distance == 0.0


def test_haversine_distance_known_distance():
    """Happy Path: Tests haversine with a known distance calculation."""
    # Distance between Seattle (47.6062, -122.3321) and Portland (45.5152, -122.6784)
    # Should be approximately 234 km
    seattle_lat, seattle_lon = 47.6062, -122.3321
    portland_lat, portland_lon = 45.5152, -122.6784
    distance = haversine_distance(seattle_lat, seattle_lon, portland_lat, portland_lon)
    # Allow 5km tolerance for calculation differences
    assert 229 <= distance <= 239


def test_haversine_distance_opposite_hemispheres():
    """Happy Path: Tests haversine across hemispheres."""
    # New York (40.7128, -74.0060) to London (51.5074, -0.1278)
    # Should be approximately 5570 km
    ny_lat, ny_lon = 40.7128, -74.0060
    london_lat, london_lon = 51.5074, -0.1278
    distance = haversine_distance(ny_lat, ny_lon, london_lat, london_lon)
    # Allow 100km tolerance
    assert 5470 <= distance <= 5670


def test_haversine_distance_equator():
    """Happy Path: Tests haversine along the equator."""
    # Two points on equator: (0, 0) and (0, 1)
    # 1 degree longitude at equator ≈ 111 km
    distance = haversine_distance(0.0, 0.0, 0.0, 1.0)
    # Allow 5km tolerance
    assert 106 <= distance <= 116


def test_haversine_distance_negative_coordinates():
    """Happy Path: Tests haversine with negative coordinates (southern/western hemisphere)."""
    # Sydney (-33.8688, 151.2093) to Melbourne (-37.8136, 144.9631)
    # Should be approximately 713 km
    sydney_lat, sydney_lon = -33.8688, 151.2093
    melbourne_lat, melbourne_lon = -37.8136, 144.9631
    distance = haversine_distance(sydney_lat, sydney_lon, melbourne_lat, melbourne_lon)
    # Allow 20km tolerance
    assert 693 <= distance <= 733


def test_haversine_distance_short_distance():
    """Happy Path: Tests haversine for very short distances (within a city)."""
    # Two points in Seattle about 1km apart
    point1_lat, point1_lon = 47.6062, -122.3321
    point2_lat, point2_lon = 47.6150, -122.3300
    distance = haversine_distance(point1_lat, point1_lon, point2_lat, point2_lon)
    # Should be less than 2km
    assert 0 < distance < 2


def test_haversine_distance_always_positive():
    """Happy Path: Tests that haversine always returns a positive value."""
    # Test with coordinates in any order
    lat1, lon1 = 40.7128, -74.0060  # New York
    lat2, lon2 = 51.5074, -0.1278   # London
    
    distance1 = haversine_distance(lat1, lon1, lat2, lon2)
    distance2 = haversine_distance(lat2, lon2, lat1, lon1)  # Reversed
    
    # Distance should be positive and symmetric
    assert distance1 > 0
    assert distance2 > 0
    assert abs(distance1 - distance2) < 0.001  # Should be identical (within floating point precision)


def test_haversine_distance_extreme_coordinates():
    """Happy Path: Tests haversine with extreme coordinates (poles, date line)."""
    # North Pole to South Pole (should be ~20,000 km)
    distance = haversine_distance(90.0, 0.0, -90.0, 0.0)
    assert 19900 <= distance <= 20100
    
    # Crossing the date line (180/-180 longitude)
    distance = haversine_distance(0.0, 179.0, 0.0, -179.0)
    # Should be ~222 km (2 degrees at equator)
    assert 220 <= distance <= 224


def test_haversine_distance_very_large_distance():
    """Happy Path: Tests haversine for very large distances (opposite sides of globe)."""
    # Points approximately opposite each other on the globe
    # Should be approximately half the Earth's circumference (~20,000 km)
    distance = haversine_distance(0.0, 0.0, 0.0, 180.0)
    assert 19900 <= distance <= 20100


# ============================================================================
# Tests for geocode_location()
# ============================================================================

@patch('utils.geolocation._get_geocoder')
def test_geocode_location_success(mock_get_geocoder):
    """Happy Path: Tests successful geocoding of a valid location."""
    # Mock the geocoder and location
    mock_location = Mock()
    mock_location.latitude = 47.6062
    mock_location.longitude = -122.3321
    
    mock_geocoder = Mock()
    mock_geocoder.geocode.return_value = mock_location
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA")
    
    assert result is not None
    assert result == (47.6062, -122.3321)
    mock_geocoder.geocode.assert_called_once_with("Seattle, Washington, USA", timeout=10)


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_not_found(mock_get_geocoder):
    """Sad Path: Tests geocoding when location is not found."""
    mock_geocoder = Mock()
    mock_geocoder.geocode.return_value = None
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Nonexistent City, Nowhere")
    
    assert result is None
    mock_geocoder.geocode.assert_called_once()


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_empty_string(mock_get_geocoder):
    """Sad Path: Tests geocoding with empty string."""
    result = geocode_location("")
    
    assert result is None
    mock_get_geocoder.assert_not_called()


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_whitespace_only(mock_get_geocoder):
    """Sad Path: Tests geocoding with whitespace-only string."""
    result = geocode_location("   ")
    
    assert result is None
    mock_get_geocoder.assert_not_called()


@patch('utils.geolocation._get_geocoder')
@patch('time.sleep')  # Mock sleep to speed up tests
def test_geocode_location_timeout_retry(mock_sleep, mock_get_geocoder):
    """Sad Path: Tests geocoding with timeout that retries."""
    mock_geocoder = Mock()
    # First call times out, second succeeds
    mock_geocoder.geocode.side_effect = [
        GeocoderTimedOut("Timeout"),
        Mock(latitude=47.6062, longitude=-122.3321)
    ]
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA", retries=3)
    
    assert result is not None
    assert result == (47.6062, -122.3321)
    assert mock_geocoder.geocode.call_count == 2


@patch('utils.geolocation._get_geocoder')
@patch('time.sleep')  # Mock sleep to speed up tests
def test_geocode_location_timeout_all_retries_fail(mock_sleep, mock_get_geocoder):
    """Sad Path: Tests geocoding when all retries timeout."""
    mock_geocoder = Mock()
    mock_geocoder.geocode.side_effect = GeocoderTimedOut("Timeout")
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA", retries=2)
    
    assert result is None
    assert mock_geocoder.geocode.call_count == 2


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_service_error(mock_get_geocoder):
    """Sad Path: Tests geocoding when service error occurs."""
    mock_geocoder = Mock()
    mock_geocoder.geocode.side_effect = GeocoderServiceError("Service error")
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA")
    
    assert result is None
    mock_geocoder.geocode.assert_called_once()


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_unavailable(mock_get_geocoder):
    """Sad Path: Tests geocoding when service is unavailable."""
    mock_geocoder = Mock()
    mock_geocoder.geocode.side_effect = GeocoderUnavailable("Service unavailable")
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA")
    
    assert result is None
    mock_geocoder.geocode.assert_called_once()


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_unexpected_error(mock_get_geocoder):
    """Sad Path: Tests geocoding when unexpected error occurs."""
    mock_geocoder = Mock()
    mock_geocoder.geocode.side_effect = ValueError("Unexpected error")
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA")
    
    assert result is None
    mock_geocoder.geocode.assert_called_once()


@patch('utils.geolocation._get_geocoder')
@patch('time.sleep')  # Mock sleep to speed up tests
def test_geocode_location_custom_retries(mock_sleep, mock_get_geocoder):
    """Happy Path: Tests geocoding with custom retry count."""
    mock_location = Mock()
    mock_location.latitude = 47.6062
    mock_location.longitude = -122.3321
    
    mock_geocoder = Mock()
    mock_geocoder.geocode.return_value = mock_location
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA", retries=5)
    
    assert result is not None
    assert result == (47.6062, -122.3321)


@patch('utils.geolocation._get_geocoder')
@patch('time.sleep')  # Mock sleep to speed up tests
def test_geocode_location_custom_delay(mock_sleep, mock_get_geocoder):
    """Happy Path: Tests geocoding with custom delay between retries."""
    mock_location = Mock()
    mock_location.latitude = 47.6062
    mock_location.longitude = -122.3321
    
    mock_geocoder = Mock()
    # First call times out, second succeeds
    mock_geocoder.geocode.side_effect = [
        GeocoderTimedOut("Timeout"),
        mock_location
    ]
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA", retries=3, delay=2.0)
    
    assert result is not None
    # Verify sleep was called with delay * attempt (2.0 * 1 = 2.0)
    mock_sleep.assert_called_once_with(2.0)


@patch('utils.geolocation._get_geocoder')
@patch('time.sleep')  # Mock sleep to speed up tests
def test_geocode_location_delay_calculation(mock_sleep, mock_get_geocoder):
    """Happy Path: Tests that delay is calculated correctly (delay * attempt)."""
    mock_location = Mock()
    mock_location.latitude = 47.6062
    mock_location.longitude = -122.3321
    
    mock_geocoder = Mock()
    # First two calls timeout, third succeeds
    mock_geocoder.geocode.side_effect = [
        GeocoderTimedOut("Timeout"),
        GeocoderTimedOut("Timeout"),
        mock_location
    ]
    mock_get_geocoder.return_value = mock_geocoder
    
    result = geocode_location("Seattle, Washington, USA", retries=3, delay=1.5)
    
    assert result is not None
    # Verify sleep was called twice: first with 1.5*1, then with 1.5*2
    assert mock_sleep.call_count == 2
    assert mock_sleep.call_args_list[0][0][0] == 1.5  # delay * 1
    assert mock_sleep.call_args_list[1][0][0] == 3.0   # delay * 2


def test_geocode_location_none_input():
    """Sad Path: Tests geocoding with None input."""
    # The function checks `if not location_string` first, which catches None
    # and returns None before trying to call .strip()
    result = geocode_location(None)
    assert result is None


@patch('utils.geolocation._get_geocoder')
def test_geocode_location_very_long_string(mock_get_geocoder):
    """Happy Path: Tests geocoding with a very long location string."""
    mock_location = Mock()
    mock_location.latitude = 40.7128
    mock_location.longitude = -74.0060
    
    mock_geocoder = Mock()
    mock_geocoder.geocode.return_value = mock_location
    mock_get_geocoder.return_value = mock_geocoder
    
    long_location = "New York, New York, United States of America, North America, Earth, Solar System"
    result = geocode_location(long_location)
    
    assert result is not None
    assert result == (40.7128, -74.0060)
    mock_geocoder.geocode.assert_called_once_with(long_location, timeout=10)


@patch('utils.geolocation.Nominatim')
def test_geocode_location_geocoder_singleton(mock_nominatim):
    """Happy Path: Tests that geocoder is only created once (singleton pattern)."""
    # Reset the module-level geocoder
    import utils.geolocation
    utils.geolocation._geocoder = None
    
    mock_geocoder_instance = Mock()
    mock_location = Mock()
    mock_location.latitude = 47.6062
    mock_location.longitude = -122.3321
    mock_geocoder_instance.geocode.return_value = mock_location
    mock_nominatim.return_value = mock_geocoder_instance
    
    # Call geocode_location multiple times
    result1 = geocode_location("Seattle, Washington, USA")
    result2 = geocode_location("Portland, Oregon, USA")
    
    # Nominatim should only be instantiated once
    assert mock_nominatim.call_count == 1
    assert result1 == (47.6062, -122.3321)
    assert result2 == (47.6062, -122.3321)
    
    # Reset for other tests
    utils.geolocation._geocoder = None

