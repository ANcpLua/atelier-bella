import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import SwirlHero from "./SwirlHero";
import { MockRouter } from "./mockups/Mocks";
import "./styles/atelier.css";

/** Swirl hero is the landing; "Zur Ausstellung" reveals the gallery app. */
function Landing() {
  const [entered, setEntered] = useState(false);
  return entered ? <App /> : <SwirlHero onEnter={() => setEntered(true)} />;
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

const isMock = window.location.hash.startsWith("#mock");

createRoot(root).render(
  <StrictMode>{isMock ? <MockRouter /> : <Landing />}</StrictMode>
);
