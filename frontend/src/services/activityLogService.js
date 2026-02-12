// region imports
import { axios } from "./api";
// endregion

// region fetch activity logs
export const fetchActivityLogs = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = "" } = params || {};

    const response = await axios.get("/activity-log", {
      params: { page, limit, search },
    });

    return response || { logs: [], total: 0 };
  } catch (err) {
    // log error and throw
    console.error("fetchActivityLogs Error:", err?.response?.data || err?.message || "");
    throw err;
  }
};
// endregion

// region delete activity log
export const deleteActivityLog = async (id = "") => {
  try {
    if (!id) return null;
    const response = await axios.delete(`/activity-log/${id}`);
    return response || null;
  } catch (err) {
    // log error and throw
    console.error("deleteActivityLog Error:", err?.response?.data || err?.message || "");
    throw err;
  }
};
// endregion
