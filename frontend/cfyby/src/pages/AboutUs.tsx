import { Box, Typography, Container } from "@mui/material";
import crowdImage from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";

export default function AboutUs() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, deepskyblue 0%, lightblue 60%, #ffffff 100%)",
        pb: "96px",
        color:"black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          pt: { xs: 8, md: 12 },
          mb: 6,
        }}
      >
        <Typography variant="h3" fontWeight={700}>
         Curated by You for You
        </Typography>
      </Box>

      
      <Container maxWidth="md">
       
        <Box
          component="img"
          src={crowdImage}
          alt="Live music crowd"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0px 10px 40px rgba(0,0,0,0.15)",
            mb: 5,
          }}
        />

        <Typography
          variant="body1"
          align="justify"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8, mb: 3 }}
        >
            In an effort to bridge the gap between music enthusiasts and their
          favorite artists, Curated by You for You was born. Our platform
          empowers users to create personalized playlists that resonate with
          their unique tastes, while also providing artists with valuable
          insights into listener preferences. By fostering a community where
          fans can directly influence the music they love, we aim to enhance the
          connection between creators and their audience. Join us in shaping the
          future of music discovery, one search at a time.
        </Typography>
      </Container>
    </Box>
  );
}
