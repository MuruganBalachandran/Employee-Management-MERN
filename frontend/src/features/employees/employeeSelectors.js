// base selector
export const selectEmployeesState = (state) => state.employees || {};

// list selectors
export const selectEmployees = (state) =>
  state.employees?.list || [];

//  filtered total (used for pagination & "no records found")
export const selectEmployeesTotal = (state) =>
  state.employees?.total || 0;

//  actual DB total (used to decide visibility of filters/table)
export const selectEmployeesOverallTotal = (state) =>
  state.employees?.overallTotal || 0;

// single employee
export const selectSelectedEmployee = (state) =>
  state.employees?.selected || null;

// ui state
export const selectEmployeesLoading = (state) =>
  state.employees?.loading || false;

export const selectEmployeesError = (state) =>
  state.employees?.error || null;

// pagination selectors
export const selectEmployeesPagination = (state) => ({
  page: state.employees?.page || 1,
  totalPages: state.employees?.totalPages || 1,
  limit: state.employees?.limit || 5,
});
