import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const AUTH_TOKEN_STORAGE_KEY = "token";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
