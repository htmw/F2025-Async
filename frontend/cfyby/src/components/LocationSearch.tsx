import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import {
  Button,
  Stack,
  Box,
  List,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  ListItemButton,
} from "@mui/material";
import { Link } from "react-router-dom";

type ArtistResult = {
  name?: string;
  genre?: string;
  city?: string;
  country?: string;
  [key: string]: any;
};

export default function LocationSearch() {
  // Frontend-specified options
  const [locationOptions] = useState([
    { city: "New York", country: "United States" },
    { city: "Chicago", country: "United States" },
    { city: "Los Angeles", country: "United States" },
  ]);

  const [genreOptions] = useState([
    "Rock",
    "Hip Hop",
    "Jazz",
    "Pop",
    "Country",
  ]);

  // Lifted search values (merged from SearchSection.tsx)
  const [values, setValues] = useState({ genre: "", country: "", city: "" });

  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ArtistResult[]>([]);

  const handleInputChange = (
    field: "genre" | "country" | "city",
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (values.genre.trim()) params.append("genre", values.genre);
      if (values.city.trim()) params.append("city", values.city);
      if (values.country.trim()) params.append("country", values.country);
      params.append("n", "50");
      const request_url = `/artists/city?${params.toString()}`;
      console.log("Request URL:", request_url);
      const response = await fetch(request_url);
      const data = await response.json();

      // Accept either array of strings or array of objects under `results`
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
  const isDisabled = loading || !values.genre;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="center"
      spacing={10}
      sx={{ justifyContent: "center", p: 4 }}
    >
      {/* Search Bar Box (layout kept from original) */}
      <Box
        sx={{
          bgcolor: "white",
          boxShadow: 4,
          borderRadius: 3,
          p: 4,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Autocomplete
          disablePortal
          options={locationOptions}
          getOptionLabel={(option) => `${option.city}, ${option.country}`}
          sx={{ width: 250 }}
          value={
            values.city ? { city: values.city, country: values.country } : null
          }
          onChange={(_, newValue) => {
            if (newValue) handleInputChange("city", newValue.city || "");
            if (newValue) handleInputChange("country", newValue.country || "");
          }}
          renderInput={(params) => <TextField {...params} label="Location" />}
        />

        <Autocomplete
          disablePortal
          options={genreOptions}
          sx={{ width: 250 }}
          value={values.genre || null}
          onChange={(_, newValue) => handleInputChange("genre", newValue || "")}
          renderInput={(params) => <TextField {...params} label="Genre" />}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSearch}
          disabled={isDisabled}
          endIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </Box>

      {/* Results box only appears after Search */}
      {showResults && (
        <Box
          sx={{
            width: 400,
            height: 600,
            borderRadius: 3,
            bgcolor: "white",
            boxShadow: 4,
            overflowY: "auto",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Artist Results
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {results.length > 0 ? (
              results.map((item, index) => (
                <ListItemButton
                  key={index}
                  divider
                  component={Link}
                  to="/artist"
                  sx={{
                    "&:hover": { bgcolor: "grey.100", cursor: "pointer" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {typeof item === "string"
                          ? item
                          : item.name ||
                            item.title ||
                            item.artistName ||
                            JSON.stringify(item)}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {(item as ArtistResult).genre ||
                        (item as ArtistResult).city
                          ? `${(item as ArtistResult).genre || ""}${(item as ArtistResult).genre && (item as ArtistResult).city ? " • " : ""}${(item as ArtistResult).city ? `${(item as ArtistResult).city}, ${(item as ArtistResult).country || ""}` : ""}`
                          : ""}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No artists found.
              </Typography>
            )}
          </List>
        </Box>
      )}
    </Stack>
  );
}
