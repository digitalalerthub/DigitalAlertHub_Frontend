import axios from "axios";

// Se crea una instancia de Axios con una configuración base
const api = axios.create({
  baseURL: "http://localhost:4000/api", // URL del backend para todas las peticiones
});

export default api;
