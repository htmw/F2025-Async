import "@fontsource/urbanist";        
import "@fontsource/urbanist/400.css"; 
import "./App.css";                   

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
