import { Box, Typography } from "@mui/material";
import Footer from "../components/Footer";
import LocationSearch from "../components/LocationSearch";
import bgImage from "../assets/recordplayer.jpg";

export default function Search() {

  return (
        <Box
      sx={{
        position: 'fixed', // take full viewport, regardless of parent
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh', // full screen height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  // vertical centering
        alignItems: 'center',      // horizontal centering
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          color: '#00aaff',
          mb: 5,
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
        }}
      >
        Search By Location
      </Typography>
      <LocationSearch />
      <Footer />
      </Box>
  );
}
