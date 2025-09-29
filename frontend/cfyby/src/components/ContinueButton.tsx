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
          backgroundColor: "deepskyblue",
          display: "flex",
        },
      },
    },
  },
});

export default function ContinueButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/search"); // this routes to the Search page
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
