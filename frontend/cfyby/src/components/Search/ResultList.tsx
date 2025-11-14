import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { ArtistResult } from "./types";

type Props = {
  results: ArtistResult[];
  show: boolean;
};

export default function ResultList({ results, show }: Props) {
  if (!show) return null;

  return (
    <Box
      sx={{
        width: { xs: "90vw", md: "900px" },
        maxWidth: { xs: "90vw", md: "900px" },
        maxHeight: "400px",
        borderRadius: 3,
        bgcolor: "white",
        boxShadow: 6,
        overflowY: "auto",
        p: 3,
        color: "black",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Artist Results
      </Typography>

      <Divider sx={{ mb: 2, borderColor: "black" }} />

      <List disablePadding>
        {results.length > 0 ? (
          results.map((item, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={`/artist/${item.name}`}
              divider
              sx={{
                alignItems: "flex-start",
                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                  fontSize: "1rem",
                },
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.05)",
                },
              }}
            >
              <ListItemText

                primary={
                  item.name || item.title || item.artistName || "Unknown Artist"
                }
                secondary={
                  <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)" }}>
                    {item.genre || item.city
                      ? `${item.genre || ""}${
                          item.genre && item.city ? " • " : ""
                        }${item.city ? `${item.city}, ${item.country || ""}` : ""}`
                      : ""}
                  </Typography>
                }
              />
            </ListItemButton>
          ))
        ) : (
          <Typography variant="body2" sx={{ p: 2, color: "rgba(0,0,0,0.6)" }}>
            No artists found.
          </Typography>
        )}
      </List>
    </Box>
  );
}
