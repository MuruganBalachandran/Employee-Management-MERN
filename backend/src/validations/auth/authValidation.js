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

// region validate signup
const validateSignup = (data = {}) => {
  const errors = [];

  const {
    name = "",
    email = "",
    password = "",
    age = undefined,
    department = "",
    phone = "",
    address = {},
  } = data;

  // Name
  const nameError = validateName(name);
  if (nameError) {
    errors.push(nameError);
  }

  // Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push(emailError);
  }

  // Password
  const passwordError = validatePassword(password, { name, email });
  if (passwordError) {
    errors.push(passwordError);
  }

  // Age (optional)
  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.push(ageError);
    }
  }

  // // Department
  // if (department !== undefined) {
  //   const deptError = validateDepartment(department);
  //   if (deptError) {
  //     errors.push(deptError);
  //   }
  // }

  // // Phone
  // if (phone !== undefined) {
  //   const phoneError = validatePhone(phone);
  //   if (phoneError) {
  //     errors.push(phoneError);
  //   }
  // }

  // // Address
  // if (address !== undefined) {
  //   const addressError = validateAddress(address);
  //   if (addressError) {
  //     errors.push(addressError);
  //   }
  // }

  // result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region validate login
const validateLogin = (data = {}) => {
  const errors = [];

  const { email, password } = data || {};

  //  Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push(emailError);
  }

  //  Password
  const passwordError = validatePassword(password);
  if (
    passwordError &&
    passwordError ===
      (VALIDATION_MESSAGES?.PASSWORD_REQUIRED || "Password is required")
  ) {
    errors.push(passwordError);
  }

  // result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateSignup, validateLogin };
// endregion
