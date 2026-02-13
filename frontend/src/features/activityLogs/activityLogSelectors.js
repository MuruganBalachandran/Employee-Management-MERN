// base selector
export const selectActivityLogsState = (state) => state.activityLog || {};

// data selectors
export const selectActivityLogs = (state) => state.activityLog?.list || [];

// filtered total (for pagination)
export const selectActivityLogsTotal = (state) => state.activityLog?.total || 0;

// pagination selectors
export const selectActivityLogsPagination = (state) => ({
  page: state.activityLog?.currentPage || 1,
  limit: state.activityLog?.limit || 20,
  totalPages: state.activityLog?.totalPages || 1,
});

// ui selectors
export const selectActivityLogsLoading = (state) =>
  state.activityLog?.loading || false;

export const selectActivityLogsError = (state) =>
  state.activityLog?.error || null;

// actual DB total
export const selectActivityLogsOverallTotal = (state) =>
  state.activityLog?.overallTotal || 0;
