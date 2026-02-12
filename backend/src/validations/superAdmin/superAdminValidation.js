// region imports
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
  validateSalary,
  validateJoiningDate,
  validateAdminCode,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { ROLE } from "../../utils/index.js";
// endregion

// region validate create admin
const validateCreateAdmin = (data = {}) => {
  const errors = {};

  const {
    name = "",
    email = "",
    password = "",
    age = 0,
    department = "",
    phone = "",
    address = {},
    salary = "",
    joiningDate = "",
    adminCode = "",
  } = data;

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email, ROLE?.ADMIN);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password, {
    Name: name,
    Email: email,
  });
  if (passwordError) errors.password = passwordError;

  const ageError = validateAge(age);
  if (ageError) errors.age = ageError;

  const deptError = validateDepartment(department);
  if (deptError) errors.department = deptError;

  const phoneError = validatePhone(phone);
  if (phoneError) errors.phone = phoneError;

  const addressError = validateAddress(address);
  if (addressError) errors.address = addressError;

  const salaryError = validateSalary(salary);
  if (salaryError) errors.salary = salaryError;

  const joiningDateError = validateJoiningDate(joiningDate);
  if (joiningDateError) errors.joiningDate = joiningDateError;

  const adminCodeError = validateAdminCode(adminCode);
  if (adminCodeError) errors.adminCode = adminCodeError;

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};
// endregion

// region validate update admin
const validateUpdateAdmin = (data = {}) => {
  const errors = {};

  const {
    name,
    age,
    department,
    phone,
    address,
    salary,
    permissions,
    isActive,
  } = data || {};

  if (name !== undefined) {
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;
  }

  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) errors.age = ageError;
  }

  if (department !== undefined) {
    const deptError = validateDepartment(department);
    if (deptError) errors.department = deptError;
  }

  if (phone !== undefined) {
    const phoneError = validatePhone(phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (address !== undefined) {
    const addressError = validateAddress(address);
    if (addressError) errors.address = addressError;
  }

  if (salary !== undefined) {
    const salaryError = validateSalary(salary);
    if (salaryError) errors.salary = salaryError;
  }

  // Admin-only
  if (permissions !== undefined) {
    if (!["GRANTED", "REVOKED"].includes(permissions)) {
      errors.permissions = "Invalid permission value";
    }
  }

  if (isActive !== undefined) {
    if (![0, 1].includes(isActive)) {
      errors.isActive = "Invalid active status";
    }
  }

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateCreateAdmin, validateUpdateAdmin };
// endregion
