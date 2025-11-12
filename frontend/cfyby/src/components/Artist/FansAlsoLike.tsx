import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

type SimilarArtist = {
  name: string;
  img: string;
  listeners: string;
};

type FansAlsoLikeProps = {
  artists: SimilarArtist[];
};

export default function FansAlsoLike({ artists }: FansAlsoLikeProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: 600,
          mb: 2,
          letterSpacing: "0.03em",
        }}
      >
        Fans also like
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.6)",
          mb: 3,
          fontSize: "0.85rem",
        }}
      >
        Suggestions for you based on similar styles and listeners
      </Typography>

      <Stack
        direction="row"
        spacing={3}
        sx={{
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {artists.map((a) => (
          <Card
            key={a.name}
            sx={{
              minWidth: 220,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              transition: "transform 0.3s ease, background 0.3s ease",
              ":hover": {
                transform: "scale(1.05)",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              flexShrink: 0,
            }}
          >
            <CardActionArea
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                image={a.img}
                alt={a.name}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  mb: 2,
                }}
              />

              <CardContent
                sx={{
                  textAlign: "center",
                  color: "white",
                  p: 0,
                  "&:last-child": { pb: 0 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  {a.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}
                >
                  {a.listeners}
                </Typography>
              </CardContent>

              <Button
                variant="contained"
                size="small"
                startIcon={<PlayArrowRoundedIcon />}
                sx={{
                  mt: 2,
                  borderRadius: "20px",
                  textTransform: "none",
                  backgroundColor: "#08a8d8ff",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#08a8d8ff" },
                }}
              >
                View Artist
              </Button>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
