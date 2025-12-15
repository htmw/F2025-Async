import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  List,
  ListItemText,
  Typography,
  Box,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ArtistRecommendationsWidgetProps {
  currentArtist?: string;
}

type AudioDbArtist = {
  name: string;
  location?: string;
};

type AudioDbData = Record<string, AudioDbArtist[]>;

type RecommendedArtist = {
  name: string;
  location?: string;
  genre: string;
};

export default function ArtistRecommendationsWidget({
  currentArtist,
}: ArtistRecommendationsWidgetProps) {
  const [results, setResults] = useState<RecommendedArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const trimmed = currentArtist?.trim();

    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    const normalizedName = trimmed.toLowerCase();

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const res = await fetch("http://127.0.0.1:8000/local/audio");

        if (!res.ok) {
          throw new Error(`Backend returned HTTP ${res.status}`);
        }

        const audioData = (await res.json()) as AudioDbData;

        let foundGenre: string | null = null;
        let artistsInGenre: AudioDbArtist[] = [];

        for (const [genre, artists] of Object.entries(audioData)) {
          if (!Array.isArray(artists)) continue;

          const match = artists.find(
            (a) => a.name && a.name.trim().toLowerCase() === normalizedName
          );

          if (match) {
            foundGenre = genre;
            artistsInGenre = artists;
            break;
          }
        }

        if (!foundGenre) {
          setError(
            "This artist was not found in the local AudioDB dataset. No recommendations available."
          );
          return;
        }

        const recs: RecommendedArtist[] = artistsInGenre
          .filter(
            (a) =>
              a.name &&
              a.name.trim().toLowerCase() !== normalizedName
          )
          .slice(0, 8)
          .map((a) => ({
            name: a.name,
            location: a.location,
            genre: foundGenre!,
          }));

        setResults(recs);

        if (recs.length === 0) {
          setError("No other artists found in the same genre.");
        }
      } catch (err) {
        console.error("Recommendation widget error:", err);
        setError("Failed to load recommended artists from local dataset.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentArtist]);

  const title = currentArtist?.trim()
    ? `Recommended Artists Based On ${currentArtist}`
    : "Recommended Artists";

  const handleClickArtist = (name: string) => {
    navigate(`/artist/${encodeURIComponent(name)}`);
  };

  return (
    <Card
      sx={{
        mt: 3,
        backgroundColor: "#181818",
        borderRadius: 2,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <CardHeader
        title={title}
        sx={{
          "& .MuiCardHeader-title": {
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "white",
          },
        }}
      />
      <CardContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        {!loading && !error && results.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No recommendations found.
          </Typography>
        )}

        {!loading && !error && results.length > 0 && (
          <List dense>
            {results.map((artist) => {
              const secondaryParts: string[] = [];
              if (artist.location) secondaryParts.push(artist.location);
              if (artist.genre) secondaryParts.push(artist.genre);

              return (
                <ListItemButton
                  key={`${artist.genre}-${artist.name}`}
                  component="li"
                  onClick={() => handleClickArtist(artist.name)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                  }}
                >
                  <ListItemText
                    primary={artist.name}
                    secondary={
                      secondaryParts.length ? secondaryParts.join(" • ") : undefined
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
