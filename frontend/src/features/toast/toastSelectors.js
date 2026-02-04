// region imports
import { createSelector } from "reselect";
// endregion

// region base selector
const selectToastState = (state) => state.toast;
// endregion

// region memoized selectors
/**
 * Select toast message
 */
export const selectToastMessage = createSelector(
    [selectToastState],
    (toast) => toast?.message ?? ""
);

/**
 * Select toast type (success, error, warning, info)
 */
export const selectToastType = createSelector(
    [selectToastState],
    (toast) => toast?.type ?? "info"
);

/**
 * Select toast visibility
 */
export const selectToastVisible = createSelector(
    [selectToastState],
    (toast) => toast?.visible ?? false
);

/**
 * Select entire toast state
 * Useful when passing to toast component
 */
export const selectToastData = createSelector(
    [selectToastState],
    (toast) => ({
        message: toast?.message ?? "",
        type: toast?.type ?? "info",
        visible: toast?.visible ?? false,
    })
);

// endregion
