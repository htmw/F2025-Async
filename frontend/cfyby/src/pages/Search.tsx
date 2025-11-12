import { Box, Typography } from "@mui/material";
import Footer from "../components/Footer";
import LocationSearch from "../components/Search/LocationSearch";
import bgImage from "../assets/recordplayer.jpg";

export default function Search() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 1,
        overflow: "hidden",
        pt: 12,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "#fff",
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#00aaff",
            mb: 5,
            fontWeight: "bold",
            textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          Search By Location
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: 900,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,

            "& .MuiFormControl-root": { width: "100%" },

            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "black" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },

            "& .MuiInputBase-input": { color: "black", fontWeight: 500 },
            "& label, & .MuiInputLabel-root": { color: "black !important" },
            "& .MuiSvgIcon-root": { color: "black" },

            "& .MuiAutocomplete-popper": {
              width: "800px !important",
              maxWidth: "90vw !important",
              left: "50% !important",
              transform: "translateX(-50%) !important",
              zIndex: 9999,
            },

            "& .MuiAutocomplete-popper .MuiPaper-root": {
              backgroundColor: "white",
              color: "black",
              borderRadius: "12px",
              border: "1px solid black",
              width: "800px",
              maxWidth: "90vw",
              boxSizing: "border-box",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            },

            "& .MuiAutocomplete-listbox": {
              backgroundColor: "white",
              color: "black",
              "& li": {
                color: "black",
                fontSize: "1rem",
                padding: "0.75rem 1rem",
              },
            },

            "& .artist-result, & .results-container, & .result-row": {
              color: "black !important",
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "10px",
              width: "800px",
              maxWidth: "90vw",
              textAlign: "left",
              padding: "1rem 1.25rem",
              boxSizing: "border-box",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            },
          }}
        >
          <LocationSearch />
        </Box>

        <Box sx={{ mt: 6 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
