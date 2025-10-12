import { Box, Typography } from "@mui/material";
import Footer from "../components/Footer";
import LocationSearch from "../components/LocationSearch";
import bgImage from "../assets/recordplayer.jpg";

export default function Search() {

  return (
        <Box
          sx={{
            position:"fixed",
            height: "100vh", // responsive
            width: "100vw",
            top: 0,
            left: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover", // covers entire area
            backgroundPosition: "center", // centers image
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignContent: "stretch",
            padding: "1rem",
            justifyContent: "flex-start",
            color: "deepskyblue",
            pt: "25vh",//height
            pl: "5vw",//width
            gap: 2,
          }}
        >
      <Typography variant="h2">Search By Location</Typography>
      <LocationSearch />
      <Footer />
      </Box>
  );
}
