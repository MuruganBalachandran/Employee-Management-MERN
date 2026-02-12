// base selector
export const selectSuperAdminState = (state) =>
  state.superAdmin;

// list selectors
export const selectAdmins = (state) =>
  state.superAdmin.list;

export const selectAdminsTotal = (state) =>
  state.superAdmin.total;

// ui state
export const selectAdminsLoading = (state) =>
  state.superAdmin.loading;

export const selectAdminsError = (state) =>
  state.superAdmin.error;
