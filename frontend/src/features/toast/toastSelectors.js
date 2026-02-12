// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectToastState = (state) => state.toast;
// endregion

// region memoized selectors
// select message
export const selectToastMessage = createSelector(
  [selectToastState],
  (toast) => toast?.message || "",
);

// select type
export const selectToastType = createSelector(
  [selectToastState],
  (toast) => toast?.type || "info",
);

// select visibility
export const selectToastVisible = createSelector(
  [selectToastState],
  (toast) => toast?.visible || false,
);

// select global loading
export const selectGlobalLoading = createSelector(
  [selectToastState],
  (toast) => toast?.loading || false,
);

// select data
export const selectToastData = createSelector([selectToastState], (toast) => ({
  message: toast?.message || "",
  type: toast?.type || "info",
  visible: toast?.visible || false,
}));
// endregion
