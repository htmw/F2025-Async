// ResultList.tsx
import {
  Box,
  List,
  ListItemText,
  CircularProgress,
  Typography,
  ListItem,
} from "@mui/material";

type Artist = {
  name: string;
  city: string;
  country: string;
};

type Props = {
  results: Artist[]; // <-- changed from string[]
  loading?: boolean;
};

export default function ResultList({ results, loading }: Props) {
  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Typography sx={{ mt: 2, color: "lightgray" }}>No results</Typography>
    );
  }

  return (
    <List sx={{ width: "min(60vw, 700px)", mt: 2 }}>
      {results.map((artist, idx) => (
        <ListItem key={idx} divider>
          <ListItemText
            primary={artist.name}
            secondary={`${artist.city}, ${artist.country}`}
          />
          <a href="/artist"></a>
        </ListItem>
      ))}
    </List>
  );
}
