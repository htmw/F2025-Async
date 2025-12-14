import "@fontsource/urbanist";
import "@fontsource/urbanist/400.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline, Box, Button } from "@mui/material";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ArtistPage from "./pages/ArtistPage";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#181818"
    },
    primary: {
      main: "#17abf0ff"
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.6)"
    }
  },
  typography: {
    fontFamily: "Urbanist, system-ui, Avenir, Helvetica, Arial, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontWeight: 600, letterSpacing: "-0.03em" },
    h2: { fontWeight: 600, letterSpacing: "-0.03em" },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 24, textTransform: "none", fontWeight: 600 }
      }
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } }
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            display: "flex",
            gap: 2,
            p: 2,
            zIndex: 9999,
            justifyContent: "center",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
          }}
        >
          <Button
            component={Link}
            to="/"
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/search"
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            Search
          </Button>

        </Box>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
        </Routes>

        
      </Router>
    </ThemeProvider>
  );
}
