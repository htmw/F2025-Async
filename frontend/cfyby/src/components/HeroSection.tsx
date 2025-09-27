import { Box, Typography } from "@mui/material";
import bgImage from "../assets/hands-holding-music-instruments.jpg";

export default function HeroSection() {
  return (
    <Box
      sx={{
        height: { xs: "40vh", md: "60vh" }, // responsive
        width: "100%",
        backgroundImage: `url(${bgImage})`, // path to your image
        backgroundSize: "cover", // cover entire area
        backgroundPosition: "center", // center the image
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "darkorchid",
      }}
    >
      <Typography variant="h3">Curated For You By You</Typography>
    </Box>
  );
}
