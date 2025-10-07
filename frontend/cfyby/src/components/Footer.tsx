import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
//had to change import style due to outdated Grid component

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        px: 2,
        py: 0.5,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        fontSize: "0.85rem",
      }}
    >
      <Grid2
        container
        alignItems="center"
        justifyContent={{ xs: "center", sm: "space-between" }}
        sx={{ flexWrap: "wrap", rowGap: 1 }}
      >
        {/* Left side footer content*/}
        <Grid2 sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
            © {new Date().getFullYear()} Curated For You By You.
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
            All rights reserved.
          </Typography>
        </Grid2>

        {/* center side footer content*/}
        <Grid2 sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
            Team Cache Me If You Can
          </Typography>
        </Grid2>

        {/* right side footer content*/}
        <Grid2>
          <Box
            sx={{
              textAlign: { xs: "center", sm: "right" },
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              paddingRight: { xs: 0, sm: 3 },
            }}
          >
            {["Home", "About", "Services", "Contact Us"].map((label) => (
              <Link
                key={label}
                href="#"
                underline="hover"
                sx={{
                  fontSize: "0.8rem",
                  color: "inherit",
                }}
              >
                {label}
              </Link>
            ))}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}
