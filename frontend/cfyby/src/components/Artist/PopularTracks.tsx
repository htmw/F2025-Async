import {
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";

type Track = {
  title: string;
  // plays: string;
  duration: string;
};

type AlbumWithTracks = {
  title: string;
  image: string;
  tracks: Track[];
};

type PopularTracksProps = {
  albums: AlbumWithTracks[];
  loading: boolean;
};

export default function PopularTracks({ albums, loading }: PopularTracksProps) {
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
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ py: 4 }}
          >
            <CircularProgress size={28} color="inherit" />
          </Stack>
        ) : (
          albums.map((album) => (
            <Box key={album.title} sx={{ mb: 3 }}>
              {/* Album Header */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ px: 2, py: 1.5 }}
              >
                <Avatar
                  variant="rounded"
                  src={album.image}
                  sx={{ width: 56, height: 56 }}
                />

                <Box>
                  <Typography sx={{ color: "white", fontWeight: 600 }}>
                    {album.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {album.tracks.length} tracks
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

              {/* Track List */}
              {album.tracks.map((track, index) => (
                <Stack
                  key={track.title}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    px: 2,
                    py: 1.25,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.07)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      width: "24px",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.9rem",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </Typography>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
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
                      {/* {track.plays} plays */}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.8rem",
                    }}
                  >
                    {track.duration}
                  </Typography>
                </Stack>
              ))}

              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
