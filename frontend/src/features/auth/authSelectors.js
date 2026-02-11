// region imports
import { createSelector } from "reselect";
// endregion

// base selector
const selectAuthState = (state) => state?.auth;

// region memoized selectors
//logged-in user object.
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth?.user || null,
);

// Extracts the role.
export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.Role || null,
);

// Check if user is authenticated
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth?.isAuthenticated || false,
);

// checks : Have we verified auth with backend yet
export const selectAuthChecked = createSelector(
  [selectAuthState],
  (auth) => auth?.authChecked || false,
);

// Select loading state
export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth?.loading || false,
);

// Select auth error
export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth?.error || null,
);

// Check if user is super admin
export const selectIsSuperAdmin = createSelector(
  [selectUserRole],
  (role) => role === "SUPER_ADMIN",
);

// Check if user is admin
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "ADMIN" || role === "SUPER_ADMIN",
);

// Select all auth state - returns the entire auth slice object
export const selectAuth = createSelector([selectAuthState], (auth) => auth);

// endregion
