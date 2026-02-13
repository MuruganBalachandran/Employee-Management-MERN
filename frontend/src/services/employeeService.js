// region imports
import { axios } from "./api";
// endregion

// region check email availability
export const checkEmailAvailability = async (email = "") => {
  try {
    if (!email) return { available: true };
    await axios.post("/employees/check-email", { email });
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

// region check employee code availability
export const checkEmployeeCodeAvailability = async (employeeCode = "") => {
  try {
    if (!employeeCode) return { available: true };
    await axios.post("/employees/check-code", { employeeCode });
    // If we reach here, code is available (200 response)
    return { available: true };
  } catch (err) {
    // If 400 error, code exists
    if (err?.response?.status === 400) {
      return { available: false, message: err?.response?.data?.message || "Employee code already exists" };
    }
    // For other errors, assume available to avoid blocking user
    return { available: true };
  }
};
// endregion

// region fetch employees
export const fetchEmployees = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      department = "",
    } = params || {};

    // axios interceptor already unwraps response
    const response = await axios.get("/employees", {
      params: { page, limit, search, department },
    });
  console.log("EMPLOYEES API RESPONSE:", response);
    return {
      employees: response?.employees || [],
      filteredTotal: response?.filteredTotal ?? 0,
      overallTotal: response?.overallTotal ?? 0,
      skip: response?.skip ?? 0,
      limit: response?.limit ?? limit,
      currentPage: response?.currentPage ?? page,
      totalPages: response?.totalPages ?? 1,
    };
  } catch (err) {
    console.error(
      "fetchEmployees Error:",
      err?.response?.data || err?.message || ""
    );

    // MUST return same shape
    return {
      employees: [],
      filteredTotal: 0,
      overallTotal: 0,
      skip: 0,
      limit: 5,
      currentPage: 1,
      totalPages: 1,
    };
  }
};
// endregion



// region fetch employee by id
export const fetchEmployeeById = async (id = "") => {
  try {
    if (!id) return null;
    const response = await axios.get(`/employees/${id}`);
    return response || null;
  } catch (err) {
    // log error
    console.error("fetchEmployeeById Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion

// region create employee
export const createEmployee = async (data = {}) => {
  try {
    const response = await axios.post("/employees", data || {});
    return response || null;
  } catch (err) {
    // log error
    console.error("createEmployee Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion

// region update employee
export const updateEmployee = async (id = "", data = {}) => {
  try {
    if (!id) return null;
    const response = await axios.patch(`/employees/${id}`, data || {});
    return response || null;
  } catch (err) {
    // log error
    console.error("updateEmployee Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion

// region delete employee
export const deleteEmployee = async (id = "") => {
  try {
    if (!id) return null;
    const response = await axios.delete(`/employees/${id}`);
    return response || null;
  } catch (err) {
    // log error
    console.error("deleteEmployee Error:", err?.response?.data || err?.message || "");
    return null;
  }
};
// endregion
