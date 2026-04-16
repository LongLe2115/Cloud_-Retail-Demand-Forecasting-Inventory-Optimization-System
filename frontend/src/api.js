import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 20000,
});

export const fetchStats = async () => {
  const { data } = await api.get("/stats");
  return data;
};

export const fetchReorder = async (filters = {}) => {
  const { data } = await api.get("/reorder", { params: filters });
  return data;
};

export const fetchForecast = async () => {
  const { data } = await api.get("/forecast");
  return data;
};

export default api;
