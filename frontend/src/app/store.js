// region imports
import { configureStore } from "@reduxjs/toolkit";

import {
  employeeReducer,
  authReducer,
  superAdminReducer,
  toastReducer,
  activityLogReducer,
} from "../features";
// endregion

// region store configuration
const store = configureStore({
  reducer: {
    employees: employeeReducer,
    auth: authReducer,
    superAdmin: superAdminReducer,
    toast: toastReducer,
    activityLog:activityLogReducer
  },
});
// endregion

// region exports
export default store;
// endregion
