import {
  Modal,
  Box,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";


type RegistrationProps = {
  open: boolean;
  onClose: () => void;
};

export default function Registration({
  open,
  onClose,
}: RegistrationProps) {
  return (
    <Modal
      open={open} onClose={onClose}
    >
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          background: "linear-gradient(135deg, deepskyblue, lightblue)",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 2,
            position: "relative",
            backgroundColor: "#ffffff",
          }}
        >

          {/* header title */}
          <Typography
            align="center"
            fontWeight={600}
            letterSpacing={1}
            mb={4}
            sx={{ color: "deepskyblue" }}
          >
            Register With Us Today!
          </Typography>

          {/* name */}
          
          <TextField
            fullWidth
            variant="outlined"
            label="Artist Name"
            margin="normal"
            autoComplete="name"
            autoFocus
            InputProps={{ sx: { color: "#000" } }}
            InputLabelProps={{ sx: { color: "Deepskyblue" } }}
          />
          {/* City*/}
        <TextField
            fullWidth
            variant="outlined"
            label="City"
            margin="normal"
            autoComplete="address-level2" 
            InputProps={{ sx: { color: "#000" } }}
            InputLabelProps={{ sx: { color: "Deepskyblue" } }}
          />
            {/* state or province*/}
        <TextField
            fullWidth
            variant="outlined"
            label="State / Region"
            margin="normal"
            autoComplete="address-level1"
            InputProps={{ sx: { color: "#000" } }}
            InputLabelProps={{ sx: { color: "Deepskyblue" } }} 
          />
            {/* Country */}
        <TextField
            fullWidth
            variant="outlined"
            label="Country"
            margin="normal"
            autoComplete="country-name" //need to be updated
            InputProps={{ sx: { color: "#000" } }}
            InputLabelProps={{ sx: { color: "Deepskyblue" } }}
          />
          {/* Genre*/}
        <TextField
            fullWidth
            variant="outlined"
            label="Genre"
            margin="normal"
            autoComplete="music-genre" //maybe changed later
            InputProps={{ sx: { color: "#000" } }}
            InputLabelProps={{ sx: { color: "Deepskyblue" } }}
          />
          {/* continue button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              py: 1.4,
              fontWeight: 600,
              background:
                "linear-gradient(90deg, lightblue, deepskyblue)",
              borderRadius: 1,
            }}
          >
            Continue
          </Button>
        </Paper>
      </Box>
    </Modal>
  );
}
