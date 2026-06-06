import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import SwirlDemo from "./SwirlDemo";
import "./styles/atelier.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

// Preview route: `/#swirl` renders the Swirl Blend hero, anything else the app.
const showSwirlDemo = window.location.hash.startsWith("#swirl");

createRoot(root).render(
  <StrictMode>{showSwirlDemo ? <SwirlDemo /> : <App />}</StrictMode>
);
