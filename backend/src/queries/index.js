// region barrel exports
export { findUserByEmail } from './auth/authQueries.js';
export {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    isEmployeeCodeTaken
} from './employee/employeeQueries.js';
export {
    findUserById,
    deleteUserAccount,
    updateUserProfile,
} from './user/userQueries.js';

export {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
} from './superAdmin/superAdminQueries.js';
// endregion
