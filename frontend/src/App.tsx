import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importación de las páginas que se van a renderizar según la ruta
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    // Router principal que envuelve toda la aplicación
    <Router>
      {/* Contenedor de las rutas */}
      <Routes>
        {/* Ruta inicial ("/") muestra la página de registro */}
        <Route path="/" element={<RegisterPage />} />
        {/* Ruta "/login" muestra la página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
