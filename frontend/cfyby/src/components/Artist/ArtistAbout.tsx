import { Box, Typography, Stack } from "@mui/material";

type ArtistAboutProps = {
  artist: {
    summary: string;
    country: string;
    city: string;
  };
};

export default function ArtistAbout({ artist }: ArtistAboutProps) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "white", fontWeight: 600, mb: 2 }}
      >
        About
      </Typography>

      <Typography
        sx={{
          color: "white",
          fontSize: "0.9rem",
          lineHeight: 1.4,
          mb: 2,
        }}
      >
        {artist.summary}
      </Typography>

      <Stack spacing={1.5}>
        {/* <Box>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            Followers
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {artist.followers}
          </Typography>
        </Box> */}

        <Box>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            Origin
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {`${artist.city}, ${artist.country}`}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
