import { useState, useEffect } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  location?: string | null;
}

export interface GeolocationState {
  data: LocationData | null;
  locLoading: boolean;
  error: Error | null;
}

type GeolocationOptions = PositionOptions;

const useGeolocation = (options?: GeolocationOptions): GeolocationState => {
  const [data, setData] = useState<LocationData | null>(null);
  const [locLoading, setLocLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const token = import.meta.env.VITE_LOCATION_IQ_TOKEN;
      const url = `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const resp = await fetch(url);
      const result = await resp.json();
      const addr = result.address || {};

      const city = addr.city || addr.town || addr.village || addr.state || null;
      let country = addr.country || null;
      if (country === "United States of America") country = "USA";

      return {
        latitude: lat,
        longitude: lon,
        timestamp: Date.now(),
        location: city ? `${city}, ${country}` : country,
      };
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const onSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      // 1. Check movement logic BEFORE calling API
      const stored = localStorage.getItem("locationData");
      const prevData = stored ? JSON.parse(stored) : null;

      const threshold = 0.01;
      const hasMoved = prevData && (
        Math.abs(latitude - prevData.latitude) > threshold ||
        Math.abs(longitude - prevData.longitude) > threshold
      );

      // 2. Use cached data if they haven't moved, otherwise fetch new
      if (prevData && !hasMoved) {
        setData(prevData);
      } else {
        const fullData = await reverseGeocode(latitude, longitude);
        if (fullData) {
          setData(fullData);
          localStorage.setItem("locationData", JSON.stringify(fullData));
        }
      }
      setLocLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(new Error(err.message));
      setLocLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, [options]); // Ensure options is stable (memoized)

  return { data, locLoading, error };
};

export default useGeolocation;
