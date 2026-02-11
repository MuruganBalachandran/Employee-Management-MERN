// region imports
import { axios } from "./api";
// endregion

// region createAdmin
export const createAdmin = async (data = {}) => {
  try {
    const response = await axios.post("/super-admin", data ?? {});
    return response ?? null;
  } catch (err) {
    console.error("Error in createAdmin:", err?.response?.data ?? err);
    return null;
  }
};
// endregion

// region deleteAdmin
export const deleteAdmin = async (id = "") => {
  try {
    const response = await axios.delete(`/super-admin/${id}`);
    return response ?? null;
  } catch (err) {
    console.error("Error in deleteAdmin:", err?.response?.data ?? err);
    return null;
  }
};
// endregion
