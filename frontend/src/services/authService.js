// region imports
import { axios } from "./api";
// endregion

// region login
export const loginUser = async (data = {}) => {
  try {
    const response = await axios.post("/auth/login", data || {});
    return response || null;
  } catch (err) {
    // log error
    console.error("loginUser Error:", err?.response?.data || err?.message || "");
    throw err;
  }
};
// endregion

// region logout
export const logoutUser = async () => {
  try {
    const response = await axios.post("/auth/logout");
    return response || null;
  } catch (err) {
    // log error
    console.error("logoutUser Error:", err?.response?.data || err?.message || "");
    throw err;
  }
};
// endregion

// region get profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/auth/profile");
    // If response is null/undefined, it means no user data
    return response || null;
  } catch (err) {
    // log error and throw it so the thunk can handle rejection
    console.error("getCurrentUser Error:", err?.response?.data || err?.message || "");
    throw err;
  }
};
// endregion
