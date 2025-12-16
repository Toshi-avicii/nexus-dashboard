import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
