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

type Props = {
  onSearch: (values: { genre: string; location: string }) => void;
  loading: boolean;
};

export default function SearchForm({ onSearch, loading }: Props) {
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
  console.log(data);

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
    onSearch(values);
  };

  const isDisabled = loading || !values.genre;

  return (
<Box
  sx={{
    bgcolor: "white",
    boxShadow: 4,
    borderRadius: 3,
    p: 4,
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
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
      <FormControlLabel
        control={<Checkbox checked={useCurrentLocation}/>}
        onChange={handleLocationCheckChange}
        label="Use Current Location"
      />

      <Autocomplete
        disablePortal={false}
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
        <InputLabel id="radius-select-label">Radius (km)</InputLabel>
        <Select
          labelId="radius-select-label"
          id="radius-select"
          value={values.radius || null}
          label="Radius (km)"
          onChange={(e) => handleInputChange("radius", Number(e.target.value))}
        >
          {radiusOptions.map((r) => (
            <MenuItem key={r} value={r}>
              {r} km
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
  );
}
