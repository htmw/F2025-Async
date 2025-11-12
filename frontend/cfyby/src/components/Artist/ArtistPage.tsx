import { Box, Stack } from "@mui/material";
import ArtistHeader from "./ArtistHeader";
import PopularTracks from "./PopularTracks";
import FansAlsoLike from "./FansAlsoLike";
import ArtistAbout from "./ArtistAbout";

export default function ArtistPage() {
  const artist = {
    name: "Lana Del Rey",
    monthlyListeners: "62,345,129",
    bannerUrl:
      " ",
    avatarUrl:
      " ",
    bio: "Lana Del Rey is a singer, songwriter, and record producer known for cinematic sound, melancholic glamour, and themes of tragic romance.",
    followers: "45,102,998",
    origin: "New York, USA",
  };

  const popularTracks = [
    {
      title: "Video Games",
      plays: "1,234,567,890",
      duration: "4:42",
      cover:
        " ",
    },
    {
      title: "Summertime Sadness",
      plays: "2,109,443,220",
      duration: "4:25",
      cover:
        " ",
    },
    {
      title: "Young and Beautiful",
      plays: "987,331,221",
      duration: "3:56",
      cover:
        " ",
    },
  ];

  const similarArtists = [
    {
      name: "Florence + The Machine",
      img: " ",
      listeners: "28,904,112 monthly listeners",
    },
    {
      name: "Halsey",
      img: " ",
      listeners: "45,110,992 monthly listeners",
    },
    {
      name: "Billie Eilish",
      img: " ",
      listeners: "77,401,021 monthly listeners",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "white",
        pb: 8,
      }}
    >
      <ArtistHeader artist={artist} />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ px: { xs: 2, md: 4 }, mt: 4 }}
      >
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <PopularTracks tracks={popularTracks} />
          <FansAlsoLike artists={similarArtists} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ArtistAbout artist={artist} />
        </Box>
      </Stack>
    </Box>
  );
}
