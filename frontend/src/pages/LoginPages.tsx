import { useState } from "react"; // Hook para manejar estado en componentes funcionales
import type { FormEvent } from "react"; // Tipo de evento de formulario (solo para tipado en TS)

function LoginPage() {
  // Estados locales
  const [email, setEmail] = useState(""); // Guarda el correo ingresado
  const [password, setPassword] = useState(""); // Guarda la contraseña ingresada

  // Manejador de envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el form
    // Aquí solo mostramos los datos por consola
    console.log("Datos de login:", { email, password });
    alert(`Login con: ${email} - ${password}`);
  };

  // Renderizado (UI)
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email} // Estado controlado
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado cuando se escribe
              placeholder="ejemplo@email.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password} // Estado controlado
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado cuando se escribe
              placeholder="********"
              required
            />
          </div>

          {/* Botón de envío */}
          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

// Exportación del componente
export default LoginPage;
