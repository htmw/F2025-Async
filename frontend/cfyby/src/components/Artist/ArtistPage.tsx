import { Box, Stack } from "@mui/material";
import ArtistHeader from "./ArtistHeader";
import PopularTracks from "./PopularTracks";
// import FansAlsoLike from "./FansAlsoLike";
import ArtistAbout from "./ArtistAbout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ArtistPage() {
  const { id } = useParams();

  const [artist, setArtist] = useState<any>({});
  const [albums, setAlbums] = useState([])

  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!id) return;

  const fetchArtist = async () => {
    setLoading(true);

    try {
      const requestUrl = `/artists/${id}`;
      console.log("Fetching:", requestUrl);

      const response = await fetch(requestUrl);
      const data = await response.json();


      const payload = data.artist || data.result || data || null;
      console.log(payload.albums[0]);
      setArtist(payload);

      const albumsList = payload?.albums || [];
      console.log(albumsList);

      setAlbums(albumsList);

    } catch (err) {
      console.error(err);
      setArtist({});
    } finally {
      setLoading(false);
    }
  };

  fetchArtist();
}, [id]);


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
          <PopularTracks albums={albums} loading={loading} />
          {/* <FansAlsoLike artists={similarArtists} /> */}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ArtistAbout artist={artist} />
        </Box>
      </Stack>
    </Box>
  );
}
