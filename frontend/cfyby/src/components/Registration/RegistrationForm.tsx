import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import RegistrationStyling from "./RegistrationStyling";
import { useState } from "react";


export default function Registration() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    artistName: "",
    city: "",
    state: "",
    country: "",
    genre: "",
    summary: "",
    image: "",
  });


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleSubmit = async () => {
  try {
    const location = [formData.city, formData.state, formData.country]
      .filter(Boolean)
      .join(", ");

    const payload = {
      name: formData.artistName,
      genre: formData.genre,
      location,
      summary: formData.summary, // optional, backend allows None
      image: formData.image,   // optional
    };

    const response = await fetch("http://localhost:8000/artists/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    setSubmitted(true);
  } catch (err) {
    console.error(err);
    alert(err instanceof Error ? err.message : "Something went wrong");
  }
};


  //after users are done submitting, reset form and close pop up
  const handleClose = () => {
    setSubmitted(false);
    setFormData({
      artistName: "",
      city: "",
      state: "",
      country: "",
      genre: "",
      summary: "",
      image: "",
    });
  };

  return (
    <>
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
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            align="center"
            fontWeight={600}
            letterSpacing={1}
            mb={4}
            sx={{ color: "deepskyblue" }}
          >
            Register With Us Today!
          </Typography>

          <RegistrationStyling
            label="Artist Name"
            autoComplete="name"
            autoFocus
            value={formData.artistName}
            onChange={(e) => handleInputChange("artistName", e.target.value)}
          />

          <RegistrationStyling
            label="City"
            autoComplete="address-level2"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />

          <RegistrationStyling
            label="State / Region"
            autoComplete="address-level1"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />

          <RegistrationStyling
            label="Country"
            autoComplete="country-name"
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
          />

          <RegistrationStyling
            label="Genre"
            autoComplete="off"
            value={formData.genre}
            onChange={(e) => handleInputChange("genre", e.target.value)}
          />

          <RegistrationStyling
            label="Artist Summary"
            autoComplete="off"
            multiline
            rows={3}
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
          />

          <RegistrationStyling
            label="Image URL"
            autoComplete="off"
            value={formData.image}
            onChange={(e) => handleInputChange("image", e.target.value)}
          />


          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              py: 1.4,
              fontWeight: 600,
              background: "linear-gradient(90deg, lightblue, deepskyblue)",
              borderRadius: 2,
            }}
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </Paper>
      </Box>

      <Dialog open={submitted} onClose={handleClose}>
        <DialogTitle>Thanks!</DialogTitle>
        <DialogContent>
          <Typography>
            Thanks for submitting your information. Keep Rocking on!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
