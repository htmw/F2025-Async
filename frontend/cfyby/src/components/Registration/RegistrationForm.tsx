import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RegistrationStyling from "./RegistrationStyling";

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
    // Initial state: 1 album with 1 track
    albums: [{ title: "", year: "", image: "", tracks: [{ title: "", duration: "" }] }],
  });

  // --- Core Input Handlers ---
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Album Logic with 3-Album Limit ---
  const addAlbum = () => {
    if (formData.albums.length < 3) {
      setFormData((prev) => ({
        ...prev,
        albums: [...prev.albums, { title: "", year: "", image: "", tracks: [{ title: "", duration: "" }] }],
      }));
    }
  };

  const removeAlbum = (index: number) => {
    const updated = [...formData.albums];
    updated.splice(index, 1);
    setFormData({ ...formData, albums: updated });
  };

// Add 'field' as a parameter to target specific keys
  const handleAlbumChange = (index: number, field: string, value: string) => {
    const updated = [...formData.albums];

    // Use square brackets to dynamically target the property
    // @ts-ignore (if using strict TS)
    updated[index][field] = value;

    setFormData({ ...formData, albums: updated });
  };

  // --- Track Logic with 5-Track Limit ---
  const addTrack = (albumIndex: number) => {
    if (formData.albums[albumIndex].tracks.length < 5) {
      const updated = [...formData.albums];
      updated[albumIndex].tracks.push({ title: "", duration: "" });
      setFormData({ ...formData, albums: updated });
    }
  };

  const removeTrack = (albumIndex: number, trackIndex: number) => {
    const updated = [...formData.albums];
    updated[albumIndex].tracks.splice(trackIndex, 1);
    setFormData({ ...formData, albums: updated });
  };

  const handleTrackChange = (
    albumIndex: number,
    trackIndex: number,
    field: "title" | "duration",
    value: string
  ) => {
  const updatedAlbums = [...formData.albums];

  // Target only the specific album AND the specific track
  updatedAlbums[albumIndex].tracks[trackIndex] = {
    ...updatedAlbums[albumIndex].tracks[trackIndex],
    [field]: value
  };

  setFormData({
    ...formData,
    albums: updatedAlbums
  });
};

  // --- Submission ---
  const handleSubmit = async () => {
    try {
      const location = [formData.city, formData.state, formData.country]
        .filter(Boolean)
        .join(", ");

      const artistPayload = {
        name: formData.artistName,
        genre: formData.genre,
        location,
        summary: formData.summary,
        image: formData.image,
      };

      const artistResponse = await fetch("http://localhost:8001/artists/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artistPayload),
      });

      if (!artistResponse.ok) throw new Error("Registration failed");

      const albumData = formData.albums;

      const discographyResponse = await fetch(
        `http://localhost:8001/artists/register/discography?artist_name=${encodeURIComponent(formData.artistName)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(albumData),
        }
      );

      if (!discographyResponse.ok) throw new Error("Registration failed");

      setSubmitted(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

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
      albums: [{ title: "", year: "", image: "", tracks: [{ title: "", duration: "" }] }],
    });
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", display: "flex", py: 5, justifyContent: "center", background: "linear-gradient(135deg, deepskyblue, lightblue)" }}>
        <Paper elevation={10} sx={{ width: "100%", maxWidth: 550, p: 4, borderRadius: 2, backgroundColor: "#ffffff" }}>
          <Typography align="center" variant="h5" fontWeight={600} mb={3} sx={{ color: "deepskyblue" }}>
            Artist Registration
          </Typography>

          {/* Artist Basic Info */}
          <RegistrationStyling label="Artist Name" value={formData.artistName} onChange={(e) => handleInputChange("artistName", e.target.value)} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <RegistrationStyling label="City" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            <RegistrationStyling label="State" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} />
          </Box>
          <RegistrationStyling label="Country" value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} />
          <RegistrationStyling label="Genre" value={formData.genre} onChange={(e) => handleInputChange("genre", e.target.value)} />

          <Divider sx={{ my: 4 }}>Discography (Max 3 Albums)</Divider>

          {/* Dynamic Albums */}
          {formData.albums.map((album, aIdx) => (
            <Box key={aIdx} sx={{ mb: 4, p: 2, border: "1px solid #e0e0e0", borderRadius: 2, backgroundColor: "#fcfcfc" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary">Album #{aIdx + 1}</Typography>
                <IconButton onClick={() => removeAlbum(aIdx)} color="error" size="small" disabled={formData.albums.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              <RegistrationStyling
                label="Album Title"
                value={album.title}
                onChange={(e) => handleAlbumChange(aIdx, "title", e.target.value)}
              />

              <RegistrationStyling
                label="Year Released"
                value={album.year}
                onChange={(e) => handleAlbumChange(aIdx, "year", e.target.value)}
              />

              <RegistrationStyling
                label="Image Link"
                value={album.image}
                onChange={(e) => handleAlbumChange(aIdx, "image", e.target.value)}
              />

              {/* Dynamic Tracks within Album */}
              <Box sx={{ mt: 2, pl: 2, borderLeft: "2px solid deepskyblue" }}>
                <Typography variant="caption" fontWeight={600} color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                  TRACK LIST (Max 5)
                </Typography>

                {album.tracks.map((track, tIdx) => (
                  <Box key={tIdx} sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <RegistrationStyling
                        label={`Track ${tIdx + 1}`}
                        value={track.title}
                        onChange={(e) => handleTrackChange(aIdx, tIdx, "title", e.target.value)}
                      />
                    </Box>
                    <Box sx={{ width: "90px" }}>
                      <RegistrationStyling
                        label="Min:Sec"
                        placeholder="0:00"
                        value={track.duration}
                        onChange={(e) => handleTrackChange(aIdx, tIdx, "duration", e.target.value)}
                      />
                    </Box>
                    <IconButton sx={{ mt: 1 }} onClick={() => removeTrack(aIdx, tIdx)} size="small" disabled={album.tracks.length === 1}>
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                ))}

                {/* Add Track Button - Hidden at 5 tracks */}
                {album.tracks.length < 5 ? (
                  <Button
                    startIcon={<AddCircleOutlineIcon />}
                    size="small"
                    onClick={() => addTrack(aIdx)}
                    sx={{ mt: 1, color: "deepskyblue" }}
                  >
                    Add Track
                  </Button>
                ) : (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    Maximum tracks reached for this album.
                  </Typography>
                )}
              </Box>
            </Box>
          ))}

          {/* Add Album Button - Disabled at 3 albums */}
          <Button
            fullWidth
            variant="outlined"
            onClick={addAlbum}
            disabled={formData.albums.length >= 3}
            sx={{ mb: 2, py: 1, borderColor: "deepskyblue", color: "deepskyblue", fontWeight: 600 }}
          >
            {formData.albums.length >= 3 ? "Album Limit Reached" : "+ Add New Album"}
          </Button>

          <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ py: 1.5, fontWeight: 700, background: "linear-gradient(90deg, lightblue, deepskyblue)" }}>
            Submit Registration
          </Button>
        </Paper>
      </Box>

      {/* Success Dialog */}
      <Dialog open={submitted} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: 600 }}>Success!</DialogTitle>
        <DialogContent>
          <Typography>Artist and discography successfully registered. Keep rocking on.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained" fullWidth sx={{ backgroundColor: "deepskyblue" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
