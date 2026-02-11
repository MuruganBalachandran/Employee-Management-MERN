// region imports
import api from "./api";
// endregion

// region employee services
export const fetchEmployees = ({
  page = 1,
  limit = 5,
  search = "",
  department = "",
  ignoreFilters = false,
} = {}) => {
  const params = { page, limit };
  if (!ignoreFilters) {
    if (search) {
      params.search = search;
    }
    if (department) {
      params.department = department;
    }
  }
  return api.get("/employees", { params });
};

export const fetchEmployeeById = (id = "") => api.get(`/employees/${id}`);

export const createEmployee = (data = {}) => api.post("/employees", data);

export const updateEmployee = (id = "", data = {}) => {
  const payload = { ...data };
  delete payload.email;
  delete payload.password;
  return api.patch(`/employees/${id}`, payload);
};
export const deleteEmployee = (id = "") => api.delete(`/employees/${id}`);
// endregion
