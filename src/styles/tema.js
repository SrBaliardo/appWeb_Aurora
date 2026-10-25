import { createTheme } from "@mui/material/styles";

export const tema = createTheme({
  palette: {
    primary: { main: "#188548", dark: "#106534" },
    secondary: { main: "#ffc136" },
    background: { default: "#fffbed", paper: "#ffffff" },
    text: { primary: "#29463c", secondary: "#6a7c71" },
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    button: { textTransform: "none", fontWeight: 800, fontSize: "1rem" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 48, borderRadius: 16, padding: "10px 22px" },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});
