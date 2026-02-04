// region imports
import axios from "axios";
// endregion

// region axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});
// endregion

// region request interceptor
api.interceptors.request.use((config = {}) => {
  // Attach token from localStorage
  const token = localStorage.getItem("token") || "";
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// endregion

// region response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle unauthorized globally
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);
// endregion

// region exports
export default api;
// endregion
