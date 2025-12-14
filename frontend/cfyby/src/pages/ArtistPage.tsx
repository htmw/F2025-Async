import { Box, Stack } from "@mui/material";
import ArtistHeader from "../components/Artist/ArtistHeader";
import PopularTracks from "../components/Artist/PopularTracks";
import ArtistAbout from "../components/Artist/ArtistAbout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ArtistPage() {
  const { id } = useParams();

  const [artist, setArtist] = useState<any>({});
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:8000/artists/${id}`);
        const data = await response.json();

        const payload = data.artist || data.result || data;
        setArtist(payload);

        const albumsList = payload?.albums || [];
        setAlbums(albumsList);
      } catch {
        setArtist({});
        setAlbums([]);
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
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ArtistAbout artist={artist} />
        </Box>
      </Stack>
    </Box>
  );
}
