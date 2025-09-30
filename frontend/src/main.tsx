import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";

// Crea el punto de entrada de la aplicación React en el elemento con id="root"
createRoot(document.getElementById("root")!).render(
  // StrictMode: herramienta de desarrollo de React para detectar problemas potenciales
  <StrictMode>
     {/* Se renderiza el componente principal de la aplicación */}
    <App />
  </StrictMode>
);
