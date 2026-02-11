// region imports
import axios from "axios";
// endregion

// region axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});
// endregion

// region request interceptor - middleware for HTTP calls.
// Requests - before they go to the server
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
// Responses - before .then() or await gets the data
api.interceptors.response.use(
  (res) => {
    // Return backend payload directly (checking for 'response' key)
    return res?.data?.response !== undefined ? res.data.response : res?.data;
  },
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
export { api as axios };
// endregion
