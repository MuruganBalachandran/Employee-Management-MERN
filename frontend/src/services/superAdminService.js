// region imports
import { axios } from "./api";
// endregion

// region check email availability
export const checkEmailAvailability = async (email = "") => {
  try {
    if (!email) return { available: true };
    await axios.post("/super-admin/check-email", { email });
    // If we reach here, email is available (200 response)
    return { available: true };
  } catch (err) {
    // If 400 error, email exists
    if (err?.response?.status === 400) {
      return { available: false, message: err?.response?.data?.message || "Email already exists" };
    }
    // For other errors, assume available to avoid blocking user
    return { available: true };
  }
};
// endregion

// region check admin code availability
export const checkAdminCodeAvailability = async (adminCode = "") => {
  try {
    if (!adminCode) return { available: true };
    await axios.post("/super-admin/check-code", { adminCode });
    // If we reach here, code is available (200 response)
    return { available: true };
  } catch (err) {
    // If 400 error, code exists
    if (err?.response?.status === 400) {
      return { available: false, message: err?.response?.data?.message || "Admin code already exists" };
    }
    // For other errors, assume available to avoid blocking user
    return { available: true };
  }
};
// endregion

// region fetch admins
export const fetchAdmins = async (params = {}) => {
  try {
    const { page = 1, limit = 5, search = "" } = params || {};

    const response = await axios.get("/super-admin", {
      params: { page, limit, search },
    });

    return response || { admins: [], total: 0 };
  } catch (err) {
    // log error
    console.error("fetchAdmins Error:", err?.response?.data || err?.message || "");
    return { admins: [], total: 0 };
  }
};
// endregion

// region create admin
export const createAdmin = async (data = {}) => {
  try {
    const response = await axios.post("/super-admin", data || {});
    return response || null;
  } catch (err) {
    // log error
    console.error("createAdmin Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion

// region update admin
export const updateAdmin = async (id = "", data = {}) => {
  try {
    const response = await axios.put(`/super-admin/${id}`, data || {});
    return response?.data?.data || null;
  } catch (err) {
    // log error
    console.error("updateAdmin Error:", err?.response?.data || err?.message || "");
    throw err;
  }
};
// endregion

// region delete admin
export const deleteAdmin = async (id = "") => {
  try {
    const response = await axios.delete(`/super-admin/${id}`);
    return response || null;
  } catch (err) {
    // log error
    console.error("deleteAdmin Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion

// region change permission
export const changeAdminPermission = async (id = "", permission = "") => {
  try {
    const response = await axios.patch(`/super-admin/${id}/permission`, {
      permission: permission || "",
    });

    return response || null;
  } catch (err) {
    // log error
    console.error("changeAdminPermission Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion

