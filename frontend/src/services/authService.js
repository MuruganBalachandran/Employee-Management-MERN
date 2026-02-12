// region imports
import { axios } from "./api";
// endregion

// region Login user
export const loginUser = async (data = {}) => {
  try {
    const response = await axios.post("/auth/login", data);
    return response || null;
  } catch (err) {
    console.error("Login service error:", err?.response?.data || err);
    throw err;
  }
};
// endregion

// region Logout user
export const logoutUser = async () => {
  try {
    const response = await axios.post("/auth/logout");
    return response || null;
  } catch (err) {
    console.error("Logout service error:", err?.response?.data || err);
    throw err;
  }
};
// endregion

// region Get current logged-in user profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/auth/profile");
    return response || {};
  } catch (err) {
    console.error(
      "Get current user service error:",
      err?.response?.data || err,
    );
    return {};
  }
};
// endregion
