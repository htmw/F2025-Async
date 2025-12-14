import { Box, Typography } from "@mui/material";
import Footer from "../components/Footer";
import LocationSearch from "../components/Search/LocationSearch";
import bgImage from "../assets/recordplayer.jpg";

export default function Search() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",

        pt: 12,

        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          px: 2,
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#00aaff",
            mb: 5,
            fontWeight: "bold",
            textShadow: "2px 2px 6px rgba(0,0,0,0.8)"
          }}
        >
          Search By Location
        </Typography>
        <Box
          sx={{
            borderRadius: "20px",
            p: { xs: 2, sm: 3 },

     
            width: "100%",
            maxWidth: {
              xs: 380,   // phones
              sm: 600,   // tablets
              md: 750    //desktops
            },
            mx: "auto",

            "& .MuiSelect-icon, & .MuiAutocomplete-endAdornment": {
              right: "12px",
              transform: "scale(1.15) translateY(-9px)",
            },

            "& .MuiOutlinedInput-root": {
              height: 48,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.95)"
            },

            "& .MuiInputBase-input": {
              color: "black",
              fontWeight: 500,
              padding: "10px 14px",
            },

            "& label": { color: "black !important" },
            "& .MuiSvgIcon-root": { color: "black" },

            "& .MuiAutocomplete-popper": {
              left: "0 !important",
              transform: "none !important",
              width: "100% !important",
            },

            "& .MuiAutocomplete-popper .MuiPaper-root": {
              backgroundColor: "white",
              color: "black",
              borderRadius: "12px",
              border: "1px solid black",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            },

            "& .MuiAutocomplete-listbox": {
              backgroundColor: "white",
              color: "black",
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