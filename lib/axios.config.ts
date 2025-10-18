import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/",
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  async (err) => {
    if (err.response?.status === 403) {
      await api.post("auth/refresh");
      return api.request(err.config);
    }
    throw err;
  }
);

export default api;
