// teller-dashboard/src/api/apiClient.js
import axios from "axios";

const detectBaseURL = () => {
  const port = window.location.port;  // "3001" or "3002"

  if (port === "3001") {
    return "http://localhost:8001";   // Bank 1 backend
  }

  if (port === "3002") {
    return "http://localhost:8002";   // Bank 2 backend
  }

  return "http://localhost:8001";     // fallback
};

const api = axios.create({
  baseURL: detectBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
