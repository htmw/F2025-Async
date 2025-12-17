import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { GENRE_LIST } from "../../utils/genreList";
import { LOCATION_LIST } from "../../utils/locationList";
import useGeolocation from "../../hooks/useGeolocation";

type SearchValues = {
  genre: string;
  location?: string;
  radius?: number;
  useCurrentLocation?: boolean;
  latitude?: number;
  longitude?: number;
};

type Props = {
  onSearch: (values: SearchValues) => void;
  onTextSearch: (query: string) => void;
  loading: boolean;
};

export default function SearchForm({ onSearch, onTextSearch, loading }: Props) {
  const [locationOptions] = useState(LOCATION_LIST);

  const [genreOptions] = useState(GENRE_LIST);

  const [radiusOptions] = useState([5, 10, 20, 50])

  const [values, setValues] = useState({
    genre: "",
    location: "",
    radius: 5,
  });

  const geoOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  }

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const { data } = useGeolocation(geoOptions);

  const handleInputChange = (
    field: "genre" | "location" | "radius",
    value: string | number
  ) => {
    if (field === "location" && useCurrentLocation) {
      setUseCurrentLocation(false);
    }
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationCheckChange = () => {
    setUseCurrentLocation(!useCurrentLocation);
    if (data) {
      setValues((prev) => ({ ...prev, ["location"]: prev.location !== data.location || !prev.location ? data.location ?? "" : "" }));
    } else {
      setValues((prev) => ({ ...prev, ["location"]: "" }));
    }
  }

  const handleClick = () => {
    const searchValues: SearchValues = {
      genre: values.genre,
      radius: values.radius,
      useCurrentLocation,
    };

    const latitude = (data as any)?.lat ?? (data as any)?.latitude;
    const longitude = (data as any)?.lon ?? (data as any)?.longitude;

    if (useCurrentLocation && latitude && longitude) {
      searchValues.latitude = latitude;
      searchValues.longitude = longitude;
    } else {
      searchValues.location = values.location;
    }

    onSearch(searchValues);
  };

  const hasLocation = useCurrentLocation || values.location.trim();
  const isDisabled = loading || (!values.genre && !hasLocation);
  const handleTextSearch = () => {
    onTextSearch(textQuery);
  };

  const [textQuery, setTextQuery] = useState("");

  return (
<Box
  sx={{
    bgcolor: "white",
    boxShadow: 4,
    borderRadius: 3,
    p: 4,
    display: "flex",
    flexDirection: { xs: "column"},
    alignItems: { xs: "center", md: "center" },
    justifyContent: { xs: "center", md: "center" },
    gap: 2,
    minWidth: { xs: "90vw", md: "1200px" },
    maxWidth: { xs: "90vw", md: "1200px" },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: "10px",
      "& fieldset": { borderColor: "black" },
      "&:hover fieldset": { borderColor: "black" },
      "&.Mui-focused fieldset": { borderColor: "black" },
    },
  }}
>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100%",
        }}
      >
      <FormControlLabel
        control={<Checkbox checked={useCurrentLocation}/>}
        onChange={handleLocationCheckChange}
        label="Use Current Location"
      />

      <Autocomplete
        disablePortal={false}
        disabled={useCurrentLocation}
        options={locationOptions}
        getOptionLabel={(option) => `${option.location}`}
        sx={{ width: 250 }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "white",
              color: "black",
            },
          },
        }}
        value={values.location ? { location: values.location } : null}
        onChange={(_, newValue) => {
          if (newValue) {
            handleInputChange("location", newValue.location || "");
          }
        }}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel id="radius-select-label">Radius (mi)</InputLabel>
        <Select
          labelId="radius-select-label"
          id="radius-select"
          value={values.radius || null}
          label="Radius (mi)"
          onChange={(e) => handleInputChange("radius", Number(e.target.value))}
        >
          {radiusOptions.map((r) => (
            <MenuItem key={r} value={r}>
              {r} mi
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
        disablePortal={false}
        options={genreOptions}
        sx={{ width: 250 }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "white",
              color: "black",
            },
          },
        }}
        value={values.genre || null}
        onChange={(_, newValue) => handleInputChange("genre", newValue || "")}
        renderInput={(params) => <TextField {...params} label="Genre" />}
      />
      <Button
        variant="contained"
        size="large"
        onClick={handleClick}
        disabled={isDisabled}
        endIcon={
          loading ? <CircularProgress size={18} color="inherit" /> : null
        }
        sx={{
          bgcolor: "#1d88b9ff",
          borderRadius: "20px",
          fontWeight: 600,
          px: 3,
          "&:hover": { bgcolor: "#1d88b9ff" },
        }}
      >
        {loading ? "Searching..." : "Search"}
      </Button>
      </Box>

      <Box
        sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 2,
        }}
      >
      <TextField
        label="Type Something Like 'Rock band from Chicago'."
        variant="outlined"
        value={textQuery}
        onChange={(e) => setTextQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleTextSearch(); } }}
        sx={{
          flexGrow: 1,
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "10px",
          "& .MuiInputBase-input": {
            color: "black",
            fontWeight: 500,
            padding: "10px 14px",
          },
          "& label": { color: "black !important" },
        }}
      />
      <Button
        variant="contained"
        size="large"
        onClick={(e) => { e.preventDefault(); handleTextSearch(); }}
        disabled={loading || !textQuery}
        endIcon={
          loading ? <CircularProgress size={18} color="inherit" /> : null
        }
        sx={{
          bgcolor: "#1d88b9ff",
          borderRadius: "20px",
          fontWeight: 600,
          px: 3,
          "&:hover": { bgcolor: "#1d88b9ff" },
        }}
        >
        {loading ? "Searching..." : "Search"}
      </Button>
      </Box>
    </Box>
  );
}
