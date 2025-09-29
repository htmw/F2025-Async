import { Box, Container, Grid, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, sm: 4 }, // smaller padding on mobile
        px: 1,
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor: "deepskyblue",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Brand */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Team Cache Me If You Can
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Curated For You By You.
              <br />
              All rights reserved.
            </Typography>
          </Grid>

          {/* Column 2: Links */}
          <Grid item xs={6} sm={3} md={4}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Links
            </Typography>
            <Link href="#" variant="body2" color="inherit" display="block">
              Home
            </Link>
            <Link href="#" variant="body2" color="inherit" display="block">
              About
            </Link>
            <Link href="#" variant="body2" color="inherit" display="block">
              Services
            </Link>
            <Link href="#" variant="body2" color="inherit" display="block">
              Contact
            </Link>
          </Grid>

          {/* Column 3: Social */}
          <Grid item xs={6} sm={3} md={4}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Follow Us
            </Typography>
            <Link href="#" variant="body2" color="inherit" display="block">
              Twitter
            </Link>
            <Link href="#" variant="body2" color="inherit" display="block">
              LinkedIn
            </Link>
            <Link href="#" variant="body2" color="inherit" display="block">
              GitHub
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
