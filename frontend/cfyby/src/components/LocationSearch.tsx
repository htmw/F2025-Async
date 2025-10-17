import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from "react";
import { Button, Stack, Box, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

export default function ArtistSearch() {
  const [locationOptions] = useState([
    { city: "New York", country: "United States" },
    { city: "Chicago", country: "United States" },
    { city: "Los Angeles", country: "United States" },
  ]);

  const [genreOptions] = useState([
    "Rock", "Hip Hop", "Rap", "Jazz", "Pop", "R&B", "Country"
  ]);

  const [artists] = useState([
    { name: "The Beatles", genre: "Rock" },
    { name: "Nas", genre: "Rap" },
    { name: "Miles Davis", genre: "Jazz" },
    { name: "Beyoncé", genre: "Pop" },
    { name: "Taylor Swift", genre: "Pop" },
    { name: "Johnny Cash", genre: "Country" },
    { name: "Kendrick Lamar", genre: "Hip Hop" },
    { name: "Amy Winehouse", genre: "R&B" },
    { name: "Drake", genre: "Hip Hop" },
    { name: "Adele", genre: "Pop" },
    { name: "Elvis Presley", genre: "Rock" },
    { name: "Billie Eilish", genre: "Pop" },
    { name: "Frank Sinatra", genre: "Jazz" },
  ]);

  // User selections
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ city: string; country: string } | null>(null);

  // Controls what results are shown
  const [showResults, setShowResults] = useState(false);
  const [filteredArtists, setFilteredArtists] = useState<typeof artists>([]);

  const handleSearch = () => {
    // Filter artists based on selected genre when Search is clicked
    const results =
      selectedGenre
        ? artists.filter((artist) => artist.genre === selectedGenre)
        : artists;

    setFilteredArtists(results);
    setShowResults(true);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems="center"
      spacing={10}
      sx={{ justifyContent: 'center', p: 4 }}
    >
      {/* Search Bar Box */}
      <Box
        sx={{
          bgcolor: 'white',
          boxShadow: 4,
          borderRadius: 3,
          p: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Autocomplete
          disablePortal
          options={locationOptions}
          getOptionLabel={(option) => `${option.city}, ${option.country}`}
          sx={{ width: 250 }}
          value={selectedLocation}
          onChange={(e, newValue) => setSelectedLocation(newValue)}
          renderInput={(params) => <TextField {...params} label="Location" />}
        />
        <Autocomplete
          disablePortal
          options={genreOptions}
          sx={{ width: 250 }}
          value={selectedGenre}
          onChange={(e, newValue) => setSelectedGenre(newValue)}
          renderInput={(params) => <TextField {...params} label="Genre" />}
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>

      {/* Results box only appears after Search */}
      {showResults && (
        <Box
          sx={{
            width: 400,
            height: 600,
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: 4,
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Artist Results
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, index) => (
                <ListItem
                  key={index}
                  divider
                  sx={{
                    '&:hover': { bgcolor: 'grey.100', cursor: 'pointer' },
                  }}
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1">{artist.name}</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{artist.genre}</Typography>}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No artists found.
              </Typography>
            )}
          </List>
        </Box>
      )}
    </Stack>
  );
}
