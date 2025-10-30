import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import {
  Button,
  Stack,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

type ArtistResult = {
  name?: string;
  genre?: string;
  city?: string;
  country?: string;
  [key: string]: any;
};

export default function LocationSearch() {
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

  const [values, setValues] = useState({
    genre: "",
    country: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ArtistResult[]>([]);

  const handleInputChange = (
    field: "genre" | "country" | "city",
    value: string
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
      direction="column"
      alignItems="center"
      spacing={3}
      sx={{
        justifyContent: "center",
        p: 4,
        width: "100%",
      }}
    >
      {!showResults && (
        <Box
          sx={{
            bgcolor: "white",
            boxShadow: 4,
            borderRadius: 3,
            p: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            minWidth: { xs: "90vw", md: "800px" },
            maxWidth: { xs: "90vw", md: "800px" },

            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "10px",
              "& fieldset": { borderColor: "black" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },

            "& .MuiInputBase-input": {
              color: "black",
              fontWeight: 500,
            },

            "& .MuiInputLabel-root": {
              color: "black",
              "&.Mui-focused": {
                color: "black",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "black",
            },

            "& .MuiAutocomplete-popper .MuiPaper-root": {
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
              border: "1px solid black",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            },

            "& .MuiAutocomplete-listbox": {
              backgroundColor: "white",
              color: "black",
              "& li": {
                color: "black",
                fontSize: "0.9rem",
                padding: "0.6rem 0.75rem",
              },
            },
          }}
        >
          <Autocomplete
            disablePortal
            options={locationOptions}
            getOptionLabel={(option) => `${option.city}, ${option.country}`}
            sx={{ width: 250 }}
            value={
              values.city
                ? { city: values.city, country: values.country }
                : null
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
            onChange={(_, newValue) =>
              handleInputChange("genre", newValue || "")
            }
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
            sx={{
              bgcolor: "#1d88b9ff",
              borderRadius: "20px",
              fontWeight: 600,
              px: 3,
              whiteSpace: "nowrap",
              "&:hover": {
                bgcolor: "#19a84d",
              },
            }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Box>
      )}

      {showResults && (
        <Box
          sx={{
            width: { xs: "90vw", md: "900px" },
            maxWidth: { xs: "90vw", md: "900px" },
            maxHeight: "400px",
            borderRadius: 3,
            bgcolor: "white",
            boxShadow: 6,
            overflowY: "auto",
            p: 3,
            color: "black",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "black",
            }}
          >
            Artist Results
          </Typography>

          <Divider sx={{ mb: 2, borderColor: "black" }} />

          <List disablePadding>
            {results.length > 0 ? (
              results.map((item, index) => (
                <ListItem
                  key={index}
                  divider
                  sx={{
                    alignItems: "flex-start",
                    "& .MuiListItemText-primary": {
                      color: "black",
                      fontWeight: 600,
                      fontSize: "1rem",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "rgba(0,0,0,0.6)",
                      fontSize: "0.9rem",
                    },
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.05)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "black", fontWeight: 600 }}
                      >
                        {typeof item === "string"
                          ? item
                          : item.name ||
                            item.title ||
                            item.artistName ||
                            JSON.stringify(item)}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(0,0,0,0.6)" }}
                      >
                        {item.genre || item.city
                          ? `${item.genre || ""}${
                              item.genre && item.city ? " • " : ""
                            }${
                              item.city
                                ? `${item.city}, ${item.country || ""}`
                                : ""
                            }`
                          : ""}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ p: 2, color: "rgba(0,0,0,0.6)" }}
              >
                No artists found.
              </Typography>
            )}
          </List>
        </Box>
      )}
    </Stack>
  );
}
