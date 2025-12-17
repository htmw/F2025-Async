import { Box, Typography, Stack } from "@mui/material";

type ArtistHeaderProps = {
  artist?: {
    name?: string;
    image?: string;
  };
};

export default function ArtistHeader({ artist }: ArtistHeaderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 280, md: 360 },

        // Sharp image + gradient blend in ONE background
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0.35) 25%,
            rgba(0,0,0,0.55) 55%,
            rgba(0,0,0,0.85) 80%,
            #000000 100%
          ),
          url(${artist?.image || ''})
        `,
        backgroundSize: "cover",        // fill area, crop instead of showing edges
        backgroundPosition: "center",   // center the important part of the image
        backgroundRepeat: "no-repeat",

        display: "flex",
        alignItems: "flex-end",
        px: { xs: 3, md: 4 },
        pb: { xs: 3, md: 4 },
        pt: { xs: 10, md: 12 },
      }}
    >
      <Stack
        spacing={1}
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.4rem", md: "4.2rem" },
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "white",
          }}
        >
          {artist?.name || 'Artist'}
        </Typography>

        {/* Buttons kept for later, but commented out */}
        {/*
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              px: 4,
              py: 1,
              fontWeight: 600,
              bgcolor: "#1ed760",
              color: "#000",
              "&:hover": {
                bgcolor: "#1ad150",
                transform: "scale(1.03)",
              },
            }}
          >
            Play
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "999px",
              px: 3.5,
              py: 0.9,
              color: "white",
              borderColor: "rgba(255,255,255,0.7)",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Follow
          </Button>
        </Stack>
        */}
      </Stack>
    </Box>
  );
}
