import Button from "@mui/material/Button";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

export default function BasicButtons() {
  const showMessage: (message: string) => void = (message) => {
    console.log(message);
  };

  return (
    <ThemeProvider theme={buttonTheme}>
      <Button
        onClick={() => showMessage("Hello")}
        variant="contained"
        endIcon={<PlayCircleIcon />}
      >
        Let's Get Searching
      </Button>
    </ThemeProvider>
  );
}
