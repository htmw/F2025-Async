import { Box, Typography, Container, Grid } from "@mui/material";


import img1 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";
import img2 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";
import img3 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";
import img4 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";
import img5 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";
import img6 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";
import img7 from "../assets/audience-crowd-people-raise-hands-enjoy-live-music-festival-concert-event_203461-519.png";

const images = [
  "/images/Ben/ben.png",
  "/images/Brian/brian.png",
  "/images/Christos/christos.png",
  "/images/Emmet/emmet.png",
  "/images/Jalen/jalen.png",
  "/images/Maya/maya.png",
  "/images/Pete/pete.png",
];


export default function Contact() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, deepskyblue 0%, lightblue 60%, #ffffff 100%)",
        pb: "96px",
        color: "#000",
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
          Contact Us
        </Typography>
      </Box>
      <Container maxWidth="lg">

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {images.map((img, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                component="img"
                src={img}
                alt={`Gallery image ${index + 1}`}
                sx={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.15)", 
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="body1"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8, mb: 3 }}
        >
          Have a question, suggestion, or idea you’d like to share? We’d love to
          hear from you. This project was built collaboratively, and feedback is
          always welcome.
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontSize: "1.05rem", lineHeight: 1.8 }}
        >
          For general inquiries, collaboration opportunities, or project-related
          questions, please reach out to our team using the group email listed
          below. Messages are reviewed collectively to ensure a timely response.
        </Typography>
      </Container>
    </Box>
  );
}
