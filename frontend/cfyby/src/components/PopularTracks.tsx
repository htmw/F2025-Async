import {
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

type Track = {
  title: string;
  plays: string;
  duration: string;
  cover: string;
};

type PopularTracksProps = {
  tracks: Track[];
};

export default function PopularTracks({ tracks }: PopularTracksProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{ color: "white", fontWeight: 600, mb: 2 }}
      >
        Popular
      </Typography>

      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {tracks.map((track, index) => (
          <Box key={track.title}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                px: 2,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.07)",
                },
              }}
            >
              <Box
                sx={{
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  position: "relative",
                }}
              >
                {index + 1}
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    opacity: 0,
                    transition: "0.15s",
                    "& svg": { fontSize: "1.5rem", color: "white" },
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <PlayArrowRoundedIcon />
                </IconButton>
              </Box>

              <Avatar
                variant="rounded"
                src={track.cover}
                sx={{ width: 48, height: 48, flexShrink: 0 }}
              />

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {track.title}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.8rem",
                  }}
                >
                  {track.plays} plays
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.8rem",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {track.duration}
              </Typography>
            </Stack>

            {index !== tracks.length - 1 && (
              <Divider
                sx={{
                  borderColor: "rgba(255,255,255,0.07)",
                  ml: "64px",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
