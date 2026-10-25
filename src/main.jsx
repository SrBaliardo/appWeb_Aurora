import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "styled-components";
import { tema } from "./styles/tema.js";
import { GlobalStyle } from "./styles/global.js";
import App from "./app/index.jsx";
import { ProviderInterface } from "./contexts/interface/index.js";
import RolagensBosque from "./components/RolagensBosque/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MuiThemeProvider theme={tema}>
      <ThemeProvider theme={tema}>
        <CssBaseline />
        <GlobalStyle />
        <ProviderInterface>
          <App />
          <RolagensBosque />
        </ProviderInterface>
      </ThemeProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
);
