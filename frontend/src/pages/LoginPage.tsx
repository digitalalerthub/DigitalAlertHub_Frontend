import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import axios from "axios";

// Componente de formulario de login
const LoginForm = () => {
  // Estados locales para manejar email, contraseña y mensajes de feedback
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Función que maneja el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recargar la página al enviar el form
    try {
      // Hace petición POST al backend con email y contraseña

      const res = await api.post("/auth/login", { email, contrasena });

      // Si la autenticación es correcta, guarda el token en localStorage
      localStorage.setItem("token", res.data.token);
      // Muestra mensaje de éxito
      setMessage("✅ Login exitoso");
    } catch (error: unknown) {
      // Si ocurre un error, se valida si es un error de Axios
      if (axios.isAxiosError(error)) {
        // Muestra mensaje del backend o un error genérico de login
        setMessage(error.response?.data?.message || "Error en el login");
      } else {
        // Si no es un error de Axios, muestra error desconocido
        setMessage("Error desconocido");
      }
    }
  };

  // Retorno del JSX: estructura visual del formulario con Bootstrap
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Ingresar
          </button>
        </form>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
};

// Exporta el componente para poder usarlo en otros archivos
export default LoginForm;
