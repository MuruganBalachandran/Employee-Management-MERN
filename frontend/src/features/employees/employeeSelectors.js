// base selector
export const selectEmployeesState = (state) => state.employees;

// list selectors
export const selectEmployees = (state) =>
  state.employees.list;

export const selectEmployeesTotal = (state) =>
  state.employees.total;

// single employee
export const selectSelectedEmployee = (state) =>
  state.employees.selected;

// ui state
export const selectEmployeesLoading = (state) =>
  state.employees.loading;

export const selectEmployeesError = (state) =>
  state.employees.error;
