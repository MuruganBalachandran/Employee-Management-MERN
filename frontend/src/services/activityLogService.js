// region imports
import { axios } from "./api";
// endregion

// region fetch activity logs
export const fetchActivityLogs = async (params = {}) => {
  try {
    // extract and normalize params
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || "";

    // perform api request
    const response = await axios.get("/activity-log", {
      params: {
        page,
        limit,
        search,
      },
    });

    // return normalized response
    return (
      response || {
        logs: [],
        filteredTotal: data?.data?.total || 0,   
      overallTotal: data?.data?.overallTotal || 0,  
        currentPage: page || 1,
        totalPages: 1,
        limit,
      }
    );
  } catch (err) {
    // handle and propagate error
    console.error(
      "fetchActivityLogs Error:",
      err?.response?.data || err?.message || "",
    );
    throw err;
  }
};
// endregion

// region delete activity log
export const deleteActivityLog = async (id = "") => {
  try {
    // validate id
    if (!id) {
      return null;
    }

    // perform delete request
    const response = await axios.delete(`/activity-log/${id || ""}`);

    // return api response
    return response || null;
  } catch (err) {
    // handle and propagate error
    console.error(
      "deleteActivityLog Error:",
      err?.response?.data || err?.message || "",
    );
    throw err;
  }
};
// endregion
