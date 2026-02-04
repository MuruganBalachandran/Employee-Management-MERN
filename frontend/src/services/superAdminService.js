// region imports
import api from "./api";
// endregion

// region super admin services

// Create a new admin (Super Admin only)
export const createAdmin = (data = {}) =>
  api.post("/super-admin/create-admin", data);

// Delete an admin by ID (Super Admin only)
export const deleteAdmin = (id = "") =>
  api.delete(`/super-admin/delete-admin/${id}`);

// endregion
