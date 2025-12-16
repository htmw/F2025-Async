import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";


export default function RegistrationStyling(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      margin="normal"
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "deepskyblue",
        },
        ...(props.InputLabelProps || {}),
      }}
      InputProps={{
        sx: {
          color: "#000",
          textAlign: "center",
        },
        ...(props.InputProps || {}),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "deepskyblue",
          },
          "&:hover fieldset": {
            borderColor: "deepskyblue",
          },
          "&.Mui-focused fieldset": {
            borderColor: "deepskyblue",
            borderWidth: 2,
          },
        },
        ...(props.sx || {}),
      }}
    />
  );
}
