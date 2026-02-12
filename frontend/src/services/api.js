// region imports
import axios from "axios";
// endregion

// region axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, //  cookies sent automatically
});
// endregion

// region response interceptor
api.interceptors.response.use(
  (res) => {
    return res?.data?.response !== undefined ? res.data.response : res?.data;
  },
  (err) => {
    if (err?.response?.status === 401) {
   
    }
    return Promise.reject(err);
  },
);
// endregion

// region exports
export { api as axios };
// endregion
