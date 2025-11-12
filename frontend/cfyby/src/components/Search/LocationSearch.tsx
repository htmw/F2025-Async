import { useState } from "react";
import { Stack } from "@mui/material";
import SearchForm from "./SearchForm";
import ResultsList from "./ResultList";
import type { ArtistResult } from "./types";

export default function LocationSearch() {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ArtistResult[]>([]);

  const handleSearch = async (values: {
    genre: string;
    city: string;
    country: string;
  }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (values.genre.trim()) params.append("genre", values.genre);
      if (values.city.trim()) params.append("city", values.city);
      if (values.country.trim()) params.append("country", values.country);
      params.append("n", "50");

      const request_url = `/artists?${params.toString()}`;
      console.log("Request URL:", request_url);

      const response = await fetch(request_url);
      const data = await response.json();
      const payload = Array.isArray(data)
        ? data
        : data.results || data.artists || [];

      setResults(payload);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setResults([]);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      spacing={4}
      sx={{ justifyContent: "center", p: 4, width: "100%" }}
    >
      <SearchForm onSearch={handleSearch} loading={loading} />
      <ResultsList results={results} show={showResults} />
    </Stack>
  );
}
