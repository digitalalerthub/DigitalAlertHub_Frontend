import { Link } from "react-router-dom";

// Componente que muestra el menú para usuarios **no autenticados**

const NavLoggedOut: React.FC = () => {
  return (
    // Lista principal del menú alineada a la derecha (Bootstrap: ms-auto = margin start auto)
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/inicio">
          Inicio
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/quienes-somos">
          Quienes somos
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/contacto">
          Contactos
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/">
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Registro
        </Link>
      </li>
    </ul>
  );
};

export default NavLoggedOut;
