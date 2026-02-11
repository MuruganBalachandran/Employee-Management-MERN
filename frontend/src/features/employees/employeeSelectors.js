// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectEmployeeState = (state) => state.employees;
// endregion

// region memoized selectors
// select employee by id
export const selectEmployeeById = createSelector(
  [selectEmployeeState],
  (employees) => employees?.byId ?? {},
);

// select all employee ids
export const selectEmployeeIds = createSelector(
  [selectEmployeeState],
  (employees) => employees?.allIds ?? [],
);

// select all employees
export const selectEmployees = createSelector(
  [selectEmployeeById, selectEmployeeIds],
  (byId, ids) => ids.map((id) => byId[id]).filter(Boolean),
);

// select current employee - to view
export const selectCurrentEmployee = createSelector(
  [selectEmployeeState],
  (employees) => employees?.currentEmployee ?? null,
);

// select total count
export const selectEmployeeCount = createSelector(
  [selectEmployeeState],
  (employees) => employees?.pagination?.total ?? 0,
);

// loading
export const selectEmployeeLoading = createSelector(
  [selectEmployeeState],
  (employees) => employees?.loading ?? false,
);

// current fetch - loading
export const selectCurrentEmployeeLoading = createSelector(
  [selectEmployeeState],
  (employees) => employees?.currentEmployeeLoading ?? false,
);

// error state
export const selectEmployeeError = createSelector(
  [selectEmployeeState],
  (employees) => employees?.error ?? null,
);

// pagination info - {skip,limit,total,currentPage}
export const selectPaginationInfo = createSelector(
  [selectEmployeeState],
  (employees) => employees?.pagination ?? {},
);

// page number
export const selectCurrentPage = createSelector(
  [selectPaginationInfo],
  (pagination) => pagination?.currentPage ?? 1,
);

// filters
export const selectEmployeeFilters = createSelector(
  [selectEmployeeState],
  (employees) => employees?.filters ?? {},
);

//
export const selectEmployeeFromNormalizedState = createSelector(
  [selectEmployeeById, (_, employeeId) => employeeId],
  (byId, employeeId) => byId[employeeId] ?? null,
);

// empty state
export const selectIsEmployeeListEmpty = createSelector(
  [selectEmployeeIds, selectEmployeeLoading],
  (ids, loading) => !loading && ids?.length === 0,
);
// endregion
