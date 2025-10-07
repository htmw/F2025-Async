import { Box, Typography } from "@mui/material";
import bgImage from "../assets/Headphone.jpg";
import ContinueButton from "./ContinueButton";

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "fixed",
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
        pt: "25vh", //height
        pl: "5vw", //width
        gap: 2,
      }}
    >
      <Typography variant="h2" color="deepskyblue">
        Curated For You, By You
      </Typography>
      <ContinueButton />
      {/* included in this section bc of the fixed position of the background photo*/}
    </Box>
  );
}
