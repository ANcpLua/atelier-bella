import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Gallery from "./Gallery";
import SwirlHero from "./SwirlHero";
import "./styles/atelier.css";

/** Swirl hero is the landing; "Zur Ausstellung" reveals the gallery. */
function Landing() {
  const [entered, setEntered] = useState(false);
  return entered ? (
    <Gallery onBack={() => setEntered(false)} />
  ) : (
    <SwirlHero onEnter={() => setEntered(true)} />
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

createRoot(root).render(
  <StrictMode>
    <Landing />
  </StrictMode>
);
