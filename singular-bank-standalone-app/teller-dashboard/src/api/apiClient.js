// // src/api/apiClient.js
import axios from "axios";

const detectBaseURL = () => {
  const port = window.location.port; // "3001", "3002", etc.

  // When running inside Docker:
  if (port === "3001") {
    // Bank 1 frontend
    return "http://localhost:8001";
  }

  if (port === "3002") {
    // Bank 2 frontend
    return "http://localhost:8002";
  }

  // Fallback for local dev (npm start on 3000, etc.)
  return process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
};

const api = axios.create({
  baseURL: detectBaseURL(),
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
