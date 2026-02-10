// region imports
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
  validateEmailDomain,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { ROLE } from "../../utils/index.js";
// endregion

// region validate create employee
const validateCreateEmployee = (data = {}) => {
  const errors = {};

  // extract values from body
  const {
    name = "",
    email = "",
    password = "",
    age = undefined,
    department = "",
    phone = "",
    address = {},
  } = data || {};

  // Name
  const nameError = validateName(name);
  if (nameError) {
    errors.name = nameError;
  }

  // Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  } else {
    // Check domain specific to employees
    const domainError = validateEmailDomain({ email, role: ROLE.EMPLOYEE });
    if (domainError) errors.email = domainError;
  }

  // Password
  const passwordError = validatePassword(password || "", {
    name,
    email,
  });
  if (passwordError) {
    errors.password = passwordError;
  }

  // Age (Required)
  const ageError = validateAge(age);
  if (ageError) {
    errors.age = ageError;
  }

  // Department (Required for Employee)
  const deptError = validateDepartment(department);
  if (deptError) {
    errors.department = deptError;
  }

  // Phone (Required for Employee)
  const phoneError = validatePhone(phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  // Address (Required for Employee)
  const addressError = validateAddress(address);
  if (addressError) {
    errors.address = addressError;
  }

  // Additional Fields
  const { salary, joiningDate, reportingManager, isActive, employeeCode } = data;

  if (salary !== undefined && (typeof salary !== 'number' || salary < 0)) errors.salary = "Salary must be a non-negative number";
  if (joiningDate !== undefined && isNaN(Date.parse(joiningDate))) errors.joiningDate = "Invalid joining date";
  // reportingManager is optional, no validation needed (just a string ID)
  if (isActive !== undefined && ![0, 1].includes(isActive)) errors.isActive = "Is Active must be 0 or 1";

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate update employee
const validateUpdateEmployee = (data = {}) => {
  const errors = {};

  const { name, password, age, department, phone, address, salary, reportingManager, joiningDate, employeeCode } = data || {};

  if (name !== undefined) {
    const nameError = validateName(name);
    if (nameError) {
      errors.name = nameError;
    }
  }

  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.age = ageError;
    }
  }

  if (department !== undefined) {
    const deptError = validateDepartment(department);
    if (deptError) {
      errors.department = deptError;
    }
  }

  if (phone !== undefined) {
    const phoneError = validatePhone(phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
  }

  if (address !== undefined) {
    const addressError = validateAddress(address);
    if (addressError) {
      errors.address = addressError;
    }
  }


  if (password !== undefined) {
    const passwordError = validatePassword(password, { name });
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateCreateEmployee, validateUpdateEmployee };
// endregion