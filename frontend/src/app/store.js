// region imports
import { configureStore } from "@reduxjs/toolkit";

import employeeReducer from "../features/employees/employeeSlice";
import authReducer from "../features/auth/authSlice";
import superAdminReducer from "../features/superAdmin/superAdminSlice";
import toastReducer from "../features/toast/toastSlice";
// endregion

// region store configuration
const store = configureStore({
  reducer: {
    employees: employeeReducer,
    auth: authReducer,
    superAdmin: superAdminReducer,
    toast: toastReducer,
  },
});
// endregion

// region exports
export default store;
// endregion
