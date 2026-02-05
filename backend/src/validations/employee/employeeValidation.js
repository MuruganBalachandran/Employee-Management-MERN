// region imports
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { VALIDATION_MESSAGES } from "../../utils/index.js";
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
  }

  // Password
  const passwordError = validatePassword(password || "", {
    name,
    email,
  });
  if (passwordError) {
    errors.password = passwordError;
  }

  // Age (Optional)
  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.age = ageError;
    }
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

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate update employee
const validateUpdateEmployee = (data = {}) => {
  const errors = {};

  const { name, age, department, phone, address } = data || {};

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

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateCreateEmployee, validateUpdateEmployee };
// endregion
