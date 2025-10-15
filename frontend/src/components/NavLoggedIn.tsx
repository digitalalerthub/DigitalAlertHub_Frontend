import { Link } from "react-router-dom";

// Definición de las props que recibe este componente
// En este caso, recibe una función llamada handleLogout
// que se ejecutará al hacer clic en "Cerrar sesión"
interface NavLoggedInProps {
  handleLogout: () => void;
}

// Componente funcional NavLoggedIn
// Se muestra cuando el usuario ha iniciado sesión correctamente
const NavLoggedIn: React.FC<NavLoggedInProps> = ({ handleLogout }) => {
  return (
    // Lista de elementos de navegación alineados a la derecha (ms-auto = margin-start auto)
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/">
          Inicio
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/quienes-somos">
          Quienes somos
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/alertas">
          Alertas
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/perfil">
          Perfil
        </Link>
      </li>
      {/* Botón de cierre de sesión */}
      {/* Usa una etiqueta <button> pero se le da el estilo de un enlace */}
      {/* Al hacer clic, ejecuta la función handleLogout enviada desde Navbar */}
      <li className="nav-item">
        <button className="nav-link btn btn-link" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/contactos">
          Contactos
        </Link>
      </li>
    </ul>
  );
};

export default NavLoggedIn;
