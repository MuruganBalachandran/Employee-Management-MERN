// region imports
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
// endregion

// region initial state
const initialState = {
  message: "",
  type: "info", // success | error | warning | info
  visible: false,
  loading: false, // global loading state
};
// endregion

// region slice
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state = {}, action = {}) => {
      const { message = "", type = "info" } = action.payload || {};
      state.message = message;
      state.type = type;
      state.visible = true;

      // trigger react-toastify
      if (message) {
        if (type === "success") toast.success(message);
        else if (type === "error") toast.error(message);
        else if (type === "warning") toast.warn(message);
        else toast.info(message);
      }
    },
    hideToast: (state = {}) => {
      // hide toast (keep for compatibility)
      state.visible = false;
      state.message = "";
    },
    setLoading: (state = {}, action = {}) => {
      // set global loading
      state.loading = !!action.payload;
    },
  },
});
// endregion

// region exports
export const { showToast, hideToast, setLoading } = toastSlice.actions;
export default toastSlice.reducer;
// endregion
