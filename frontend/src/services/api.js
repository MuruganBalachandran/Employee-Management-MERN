// region imports
import axios from "axios";
// endregion

// region axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
// endregion

// region interceptors
api.interceptors.response.use(
  (res = {}) => {
    // Return the specific response data from our standard API envelope
    // If res.data.response is null but status is SUCCESS, we still want to be careful.
    // Convention: backend returns { status: "SUCCESS", message: "...", response: <data> }
    return res?.data?.response !== undefined ? res.data.response : res.data;
  },
  (err) => {
    // Return a regular rejected promise for errors
    return Promise.reject(err);
  }
);
// endregion

// region exports
export { api as axios };
// endregion
