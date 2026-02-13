// region selectors
export const selectSuperAdminState = (state) => state.superAdmin;

export const selectAdmins = (state) =>
  state.superAdmin.list || [];

// filtered count (used for pagination + empty state)
export const selectAdminsTotal = (state) =>
  state.superAdmin.filteredTotal || 0;

// actual DB count (optional, for header badges etc.)
export const selectAdminsOverallTotal = (state) =>
  state.superAdmin.overallTotal || 0;

export const selectAdminsLoading = (state) =>
  state.superAdmin.loading || false;

export const selectAdminsError = (state) =>
  state.superAdmin.error || null;

export const selectAdminsPagination = (state) => ({
  page: state.superAdmin.page || 1,
  totalPages: state.superAdmin.totalPages || 1,
  limit: state.superAdmin.limit || 5,
});
// endregion

