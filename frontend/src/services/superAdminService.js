// region imports
import api from "./api";
// endregion

// region super admin services
export const createAdmin = (data = {}) => api.post("/super-admin", data);
export const deleteAdmin = (id = "") => api.delete(`/super-admin/${id}`);
// endregion
