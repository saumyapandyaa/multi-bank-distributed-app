import axios from "axios";

export const createApiClient = (token, branchId) => {
  const BRANCH_URLS = {
    A: process.env.REACT_APP_BRANCH_A,
    B: process.env.REACT_APP_BRANCH_B,
    C: process.env.REACT_APP_BRANCH_C,
  };

  const baseURL = BRANCH_URLS[branchId];

  const client = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};
