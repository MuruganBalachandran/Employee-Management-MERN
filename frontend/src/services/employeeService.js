// region imports
import { axios } from "./api";
// endregion

// region fetchEmployees
export const fetchEmployees = async ({
  page = 1,
  limit = 5,
  search = "",
  department = "",
  ignoreFilters = false,
} = {}) => {
  try {
    const params = { page, limit };
    if (!ignoreFilters) {
      if (search) params.search = search;
      if (department) params.department = department;
    }
    const response = await axios.get("/employees", { params });
    return response ?? [];
  } catch (err) {
    console.error("Error in fetchEmployees:", err?.response?.data ?? err);
    return []; // default empty array
  }
};
// endregion

// region fetchEmployeeById
export const fetchEmployeeById = async (id = "") => {
  try {
    const response = await axios.get(`/employees/${id}`);
    return response ?? null;
  } catch (err) {
    console.error("Error in fetchEmployeeById:", err?.response?.data ?? err);
    return null; // default null
  }
};
// endregion

// region createEmployee
export const createEmployee = async (data = {}) => {
  try {
    const response = await axios.post("/employees", data ?? {});
    return response ?? null;
  } catch (err) {
    console.error("Error in createEmployee:", err?.response?.data ?? err);
    return null;
  }
};
// endregion

// region updateEmployee
export const updateEmployee = async (id = "", data = {}) => {
  try {
    const payload = { ...data };
    delete payload.email; // prevent email updates
    delete payload.password; // prevent password updates
    const response = await axios.patch(`/employees/${id}`, payload);
    return response ?? null;
  } catch (err) {
    console.error("Error in updateEmployee:", err?.response?.data ?? err);
    return null;
  }
};
// endregion

// region deleteEmployee
export const deleteEmployee = async (id = "") => {
  try {
    const response = await axios.delete(`/employees/${id}`);
    return response ?? null;
  } catch (err) {
    console.error("Error in deleteEmployee:", err?.response?.data ?? err);
    return null;
  }
};
// endregion
