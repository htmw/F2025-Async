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
  const stored = localStorage.getItem("locationData");
  if (stored) {
    console.log("API Skipped")
    return JSON.parse(stored);
  }

  try {
    console.log("API Running")
    const token = import.meta.env.VITE_LOCATION_IQ_TOKEN;
    if (!token) throw new Error("LocationIQ token not defined");

    const url = `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Reverse geocoding failed: ${resp.status}`);

    const result = await resp.json();
    const addr = result.address || {};

    const city = addr.city || addr.town || addr.village || addr.state || null;
    const country = addr.country || null;

    const locationData = { lat, lon, city, country };
    return locationData;
  } catch (err: any) {
    console.error("Reverse geocoding error:", err);
    return { city: null, country: null };
  }
};


  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by your browser"));
      setLocLoading(false);
      return;
    }

    const onSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;

      const hasMovedSignificantly = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
        threshold = 0.01 // roughly ~1 km, depends on latitude
      ) => {
        return Math.abs(lat1 - lat2) > threshold || Math.abs(lon1 - lon2) > threshold;
      };

      // Usage
      const storedCoords = JSON.parse(localStorage.getItem("coords") || "{}");
      if (storedCoords.lat && storedCoords.lon) {
        if (hasMovedSignificantly(latitude, longitude, storedCoords.lat, storedCoords.lon)) {
          localStorage.removeItem("locationData");
          console.log("User moved far enough to update location");
        }
      }

      const address = await reverseGeocode(latitude, longitude);
      console.log(address)

      if (address.country === "United States of America") {
        address.country = "USA"
      }

      setData(address);

      if (!localStorage.getItem('locationData')) {
        localStorage.setItem('locationData', JSON.stringify(address))
      }

      setLocLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(new Error(err.message));
      setLocLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, []);

  return { data, locLoading, error };
};

export default useGeolocation;
