// region imports
import api from "./api";
// endregion

// region employee services

// fetch list of employees with optional filters and pagination
export const fetchEmployees = ({
  page = 1,
  limit = 5,
  search = "",
  department = "",
  ignoreFilters = false,
} = {}) => {
  const params = { page, limit };

  // apply search and department filters only if not ignored
  if (!ignoreFilters) {
    if (search) params.search = search;
    if (department) params.department = department;
  }

  // send GET request to /employees with query params
  return api.get("/employees", { params });
};

// fetch single employee by ID
export const fetchEmployeeById = (id = "") =>
  api.get(`/employees/${id}`);

// create a new employee
export const createEmployee = (data = {}) =>
  api.post("/employees", data);

// update existing employee
export const updateEmployee = (id = "", data = {}) => {
  const payload = { ...data };

  // remove fields that cannot be updated
  delete payload.email;    // email can never be updated
  delete payload.password; // password can never be updated

  // send PATCH request to /employees/:id
  return api.patch(`/employees/${id}`, payload);
};

// delete an employee by ID
export const deleteEmployee = (id = "") =>
  api.delete(`/employees/${id}`);

// endregion
