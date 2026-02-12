// region imports
import { axios } from "./api";
// endregion

// region fetch Activity Log Services
export const fetchActivityLogs = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  try {
    const params = { page, limit };
    if (search) params.search = search;

    const response = await axios.get("/activity-log", { params });
    return response || { logs: [], total: 0 };
  } catch (err) {
    console.error("Error in fetchActivityLogs:", err?.response?.data || err);
    return { logs: [], total: 0 };
  }
};

// delete activity log service
export const deleteActivityLog = async (id = "") => {
  try {
    const response = await axios.delete(`/activity-log/${id}`);
    return response || null;
  } catch (err) {
    console.error("Error in deleteActivityLog:", err?.response?.data || err);
    return null;
  }
};
// endregion
