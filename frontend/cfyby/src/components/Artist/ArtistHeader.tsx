import { Box, Avatar, Typography, Button, Stack } from "@mui/material";

type ArtistHeaderProps = {
  artist: {
    name: string;
    image: string;
    // bannerUrl: string;
    // avatarUrl: string;
    // monthlyListeners: string;
  };
};

export default function ArtistHeader({ artist }: ArtistHeaderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 240, md: 320 },
        // backgroundImage: `linear-gradient(
        //   to bottom,
        //   rgba(0,0,0,0.4) 0%,
        //   rgba(0,0,0,0.8) 70%
        // ), url(${artist.bannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: { xs: 2, md: 4 },
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-end">
        <Avatar
          src={artist.image}
          alt={artist.name}
          sx={{
            width: { xs: 80, md: 140 },
            height: { xs: 80, md: 140 },
            border: "3px solid rgba(255,255,255,0.4)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
          }}
        />

        <Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "4rem" },
              lineHeight: 1.1,
              color: "white",
            }}
          >
            {artist.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}
          >
            {/* {artist.monthlyListeners} monthly listeners */}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "24px",
                fontWeight: 600,
                px: 3,
                backgroundColor: "#1d88b9ff",
                "&:hover": { backgroundColor: "#1d88b9ff" },
              }}
            >
              Follow
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "24px",
                borderColor: "rgba(255,255,255,0.5)",
                color: "white",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Play
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
