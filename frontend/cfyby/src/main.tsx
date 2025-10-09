import "@fontsource/urbanist";         // loads font
import "@fontsource/urbanist/400.css"; // optional weight
import "./App.css";                    // <-- must be imported here

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
