import Button from "@mui/material/Button";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";


const buttonTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "16px 16px",
          margin: "16px",
          fontSize: "1.25rem",
          fontFamily: '"Urbanist", system-ui, Avenir, Helvetica, Arial, sans-serif',
          fontWeight: 500,
          backgroundColor: "deepskyblue",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "none", 
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: "dodgerblue",
          },
        },
      },
    },
  },
});

export default function ContinueButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ThemeProvider theme={buttonTheme}>
        <Button
          onClick={handleClick}
          variant="contained"
          endIcon={<PlayCircleIcon />}
        >
          Let's Get Searching
        </Button>
      </ThemeProvider>
    </div>
  );
}
