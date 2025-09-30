import { useState } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Componente de formulario de registro
const RegisterForm = () => {
  // Estados para guardar la información ingresada por el usuario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [message, setMessage] = useState("");

  // Hook de React Router para redirigir a otra ruta
  const navigate = useNavigate(); // ✅ inicializar useNavigate

  // Función que maneja el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recargar la página al enviar el form

    try {
      // Se hace petición POST al backend con los datos del formulario
      const res = await api.post("/auth/register", {
        nombre,
        apellido,
        email,
        contrasena,
        telefono,
      });

      // Muestra mensaje de éxito recibido del backend o uno genérico
      setMessage(res.data.message || "✅ Registro exitoso");

      // Redirigir después de 1.5 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: unknown) {
      // Si el backend devuelve un mensaje, se muestra; si no, se muestra genérico
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Error en el registro");
      } else {
        // Si no es error de Axios, muestra error desconocido
        setMessage("Error desconocido");
      }
    }
  };

  // Retorno del JSX: estructura visual del formulario
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Registro</h3>
        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          {/* Apellido */}
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              placeholder="Tu apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          {/* Correo */}
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

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              className="form-control"
              placeholder="Número de teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <button type="submit" className="btn btn-success w-100">
            Registrarse
          </button>
        </form>

        {/* Mensaje */}
        {message && (
          <div
            className={`alert mt-3 text-center ${
              message.startsWith("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

// Exporta el componente para usarlo en otras partes de la app
export default RegisterForm;
