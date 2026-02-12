// region base selector
export const selectAuth = (state) => state.auth;
// endregion

// region basic selectors
export const selectUser = (state) => state.auth.user;

export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state) =>
  state.auth.loading;

export const selectAuthError = (state) =>
  state.auth.error;
// endregion

// region role selectors
export const selectUserRole = (state) =>
  state.auth.user?.Role || null;

export const selectIsSuperAdmin = (state) =>
  state.auth.user?.Role === "SUPER_ADMIN";

export const selectIsAdmin = (state) =>
  state.auth.user?.Role === "ADMIN";
// endregion
