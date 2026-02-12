// base selector
export const selectActivityLogsState = (state) => state.activityLogs;

// data selectors
export const selectActivityLogs = (state) => state.activityLogs.list;

export const selectActivityLogsTotal = (state) => state.activityLogs.total;

// pagination selectors
export const selectActivityLogsPagination = (state) => ({
  page: state.activityLogs.currentPage,
  limit: state.activityLogs.limit,
  totalPages: state.activityLogs.totalPages,
});

// ui selectors
export const selectActivityLogsLoading = (state) => state.activityLogs.loading;

export const selectActivityLogsError = (state) => state.activityLogs.error;
