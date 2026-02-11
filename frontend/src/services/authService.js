// region imports
import { axios } from "./api";
// endregion

// region login services
export const loginUser = async (data = {}) => {
  try {
    const response = await axios.post("/auth/login", data || {});
    return response || null;
  } catch (err) {
    console.error("Error in login service:", err?.response?.data || err);
    throw err;
  }
};
// endregion

// region login services
export const logoutUser = async () => {
  try {
    const response = await axios.post("/auth/logout");
    return response || null;
  } catch (err) {
    console.error("Error in logout service:", err?.response?.data || err);
    throw err;
  }
};
// endregion

// region login services
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/users/getProfile");
    return response || {};
  } catch (err) {
    console.error(
      "Error in get current user service:",
      err?.response?.data || err
    );
    return {}; 
  }
};
// endregion

// region login services
export const editCurrentUser = async (data = {}) => {
  try {
    const response = await axios.patch("/users/updateProfile", data || {});
    return response || null;
  } catch (err) {
    console.error(
      "Error in edit current user service:",
      err?.response?.data || err
    );
    throw err;
  }
};
// endregion
