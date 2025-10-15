import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

// Importación de las páginas que se van a renderizar según la ruta
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/NavBar"; 

function App() {
  return (
    // Router principal que envuelve toda la aplicación
    <Router>
      <Navbar />
      {/* Contenedor de las rutas */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {/*Contenedor global de notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
