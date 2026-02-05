// region imports
import { configureStore } from "@reduxjs/toolkit";

import {
  employeeReducer,
  authReducer,
  superAdminReducer,
  toastReducer,
} from "../features";
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
