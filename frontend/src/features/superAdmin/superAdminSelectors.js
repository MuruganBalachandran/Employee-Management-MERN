// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectSuperAdminState = (state) => state.superAdmin;
// endregion

//  super admin loading
export const selectSuperAdminLoading = createSelector(
  [selectSuperAdminState],
  (state) => state?.loading || false,
);

// super admin error
export const selectSuperAdminError = createSelector(
  [selectSuperAdminState],
  (state) => state?.error || null,
);
// endregion
