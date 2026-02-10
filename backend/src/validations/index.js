// region barrel exports
export { validateLogin } from './auth/authValidation.js';
export { validateCreateEmployee, validateUpdateEmployee } from './employee/employeeValidation.js';
export { validatePhone, validateAddress, validateEmailDomain } from './helpers/typeValidations.js';
export { validationError } from './helpers/validationError.js';
export { validateCreateAdmin } from './superAdmin/superAdminValidation.js';
// endregion
