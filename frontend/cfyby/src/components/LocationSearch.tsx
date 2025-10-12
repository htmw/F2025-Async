import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from "react";
import { Button, Stack } from '@mui/material';

export default function LocationSearch() {

  const [locationOptions, setLocationOptions] = useState([
    "New York, United States",
    "Los Angeles, United States",
    "Chicago, United States"
  ]);

  return (
    <Stack direction="row" spacing={2}>
      <Autocomplete
      disablePortal
      options={locationOptions}
      sx={{
        width: 500,
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
          bgcolor: 'white', // input background
          color: 'black',   // input text color
        },
        '& .MuiAutocomplete-listbox': {
          bgcolor: 'white', // dropdown background
          color: 'black',
        },
      }}
      renderInput={(params) => <TextField {...params} label="Location" />}
        />
        <Button variant="contained" size='large'>Search</Button>
    </Stack>
  )
}
