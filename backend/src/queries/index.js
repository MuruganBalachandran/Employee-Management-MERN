// region barrel exports
export {
  findUserByEmail,
  getProfileQuery,
  isEmailExists,
} from "./auth/authQueries.js";
export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmployeeCodeExists,
} from "./employee/employeeQueries.js";

export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  updateAdminDetails,
  updateAdminPermission,
  isAdminCodeExists,
  
} from "./superAdmin/superAdminQueries.js";
// endregion

export {
  createActivityLog,
  getActivityLogs,
  deleteActivityLog,
}
from "./activityLog/activityLog.js"