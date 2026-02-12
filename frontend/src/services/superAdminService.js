// region imports
import { axios } from "./api";
// endregion

// region fetch admin Service

export const fetchAdmins = async ({
  page = 1,
  limit = 5,
  search = "",
  ignoreFilters = false,
} = {}) => {
  try {
    const params = { page, limit };
    if (!ignoreFilters && search) params.search = search;

    const response = await axios.get("/super-admin", { params });
    return response || { admins: [], total: 0 };
  } catch (err) {
    console.error("Error in fetchAdmins:", err?.response?.data || err);
    return { admins: [], total: 0 };
  }
};

// region create admin
export const createAdmin = async (data = {}) => {
  try {
    const response = await axios.post("/super-admin", data);
    return response || null;
  } catch (err) {
    console.error("Error in createAdmin:", err?.response?.data || err);
    return null;
  }
};

// region upodate admin
export const updateAdmin = async (id = "", data = {}) => {
  try {
    const response = await axios.put(`/super-admin/${id}`, data);
    return response || null;
  } catch (err) {
    console.error("Error in updateAdmin:", err?.response?.data || err);
    return null;
  }
};

// region deleet admin
export const deleteAdmin = async (id = "") => {
  try {
    const response = await axios.delete(`/super-admin/${id}`);
    return response || null;
  } catch (err) {
    console.error("Error in deleteAdmin:", err?.response?.data || err);
    return null;
  }
};

// region change permission
export const changeAdminPermission = async (id = "", permission = "") => {
  try {
    const response = await axios.patch(`/super-admin/${id}/permission`, {
      permission,
    });
    return response || null;
  } catch (err) {
    console.error("Error in changeAdminPermission:", err?.response?.data || err);
    return null;
  }
};

// endregion

