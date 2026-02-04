// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectAuthState = (state) => state?.auth;
// endregion

// region memoized selectors
export const selectUser = createSelector(
    [selectAuthState],
    (auth) => auth?.user || null
);

/**
 * Select user role
 * Useful for role-based components
 */
export const selectUserRole = createSelector(
    [selectUser],
    (user) => user?.Role || null
);

/**
 * Check if user is authenticated
 */
export const selectIsAuthenticated = createSelector(
    [selectAuthState],
    (auth) => auth?.isAuthenticated || false
);

/**
 * Check if auth has been verified
 * Useful for showing loading states on app start
 */
export const selectAuthChecked = createSelector(
    [selectAuthState],
    (auth) => auth?.authChecked || false
);

/**
 * Select loading state
 */
export const selectAuthLoading = createSelector(
    [selectAuthState],
    (auth) => auth?.loading || false
);

/**
 * Select auth error
 */
export const selectAuthError = createSelector(
    [selectAuthState],
    (auth) => auth?.error || null
);

/**
 * Check if user is super admin
 * Composed selector for convenience
 */
export const selectIsSuperAdmin = createSelector(
    [selectUserRole],
    (role) => role === "SUPER_ADMIN"
);

/**
 * Check if user is admin (includes super_admin)
 * Composed selector for convenience
 */
export const selectIsAdmin = createSelector(
    [selectUserRole],
    (role) => role === "ADMIN" || role === "SUPER_ADMIN"
);

/**
 * Select all auth state (use sparingly)
 * For cases where multiple auth fields are needed together
 */
export const selectAuth = createSelector(
    [selectAuthState],
    (auth) => auth
);

// endregion
