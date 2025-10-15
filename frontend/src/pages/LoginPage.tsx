import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Componente de formulario de login
const LoginForm = () => {
  // Estados locales para manejar email, contraseña y mensajes de feedback
  const [email, setEmail] = useState("");
  const [contrasena, setPassword] = useState("");
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recargar la página al enviar el form

    try {
      const res = await api.post("/auth/login", { email, contrasena }); // Hace petición POST al backend con email y contraseña
      localStorage.setItem("token", res.data.token); // Si la autenticación es correcta, guarda el token en localStorage

      // Notificación de éxito
      toast.success("Login exitoso", {
        position: "top-right",
        autoClose: 3000,
      });
      // Redirigir después de un breve tiempo
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: unknown) {
      // Si ocurre un error, se valida si es un error de Axios
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error en el login", {
          // Muestra mensaje del backend o un error genérico de login
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Si no es un error de Axios, muestra error desconocido
        toast.error("Error desconocido", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Retorno del JSX: estructura visual del formulario con Bootstrap
  return (
    <div className="login-background d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "360px", borderRadius: "15px" }}
      >
        {/* Icono superior */}
        <div className="text-center mb-3">
          <i className="bi bi-box-arrow-in-right fs-1 text-primary"></i>
        </div>

        {/* Título */}
        <h3 className="text-center mb-4 fw-bold">Iniciar Sesión</h3>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="position-relative mb-3">
            <i
              className="bi bi-envelope position-absolute top-50 translate-middle-y ms-3 text-secondary"
              style={{ pointerEvents: "none" }}
            ></i>
            <input
              type="email"
              className="form-control ps-5"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="position-relative mb-4">
            <i
              className="bi bi-lock position-absolute top-50 translate-middle-y ms-3 text-secondary"
              style={{ pointerEvents: "none" }}
            ></i>
            <input
              type="password"
              className="form-control ps-5"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <div className="d-flex justify-content-center mb-3">
            <button type="submit" className="btn btn-primary w-50">
              Ingresar
            </button>
          </div>

          {/* Enlaces inferiores */}
          <div className="text-center mt-3">
            <p className="mb-1">
              <a href="#" className="text-decoration-none text-muted">
                ¿Olvidaste la contraseña?
              </a>
            </p>
            <p className="text-muted">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/register"
                className="fw-semibold text-primary text-decoration-none"
              >
                Crear cuenta
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
