import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NavLoggedOut from "./NavLoggedOut";
import NavLoggedIn from "./NavLoggedIn";

// Componente principal de la barra de navegación
const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Estado para saber si el usuario está logueado o no

  // useEffect se ejecuta una vez al montar el componente
  // Aquí verificamos si existe un token guardado en el localStorage
  // Si existe, asumimos que el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem("token"); // Puedes adaptar según tu lógica de auth
    if (token) setIsLoggedIn(true);
  }, []);

  // Función para cerrar sesión
  // Elimina el token del localStorage y actualiza el estado
  const handleLogout = (): void => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    // Navbar con clases de Bootstrap para color, posición y espaciado
    <nav className="navbar navbar-expand-lg navbar-dark position-absolute w-100 p-3 navbar-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="/Texto_Slogan_Transparente.png"
            alt="Logo"
            width="280"
            height="80"
          />
        </Link>

        {/* Botón tipo "hamburguesa" para el menú en dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor colapsable del menú */}
        {/* Si el usuario está logueado, mostramos NavLoggedIn */}
        {/* Si no lo está, mostramos NavLoggedOut */}

        {/* Menú según autenticación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {isLoggedIn ? (
            <NavLoggedIn handleLogout={handleLogout} />
          ) : (
            <NavLoggedOut />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
