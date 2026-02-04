// region imports
import {
  validateName,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { VALIDATION_MESSAGES } from "../../utils/index.js";
// endregion

// region validate update profile
const validateUpdateProfile = (data = {}) => {
  const errors = [];

  const { name, password, age, department, phone, address } = data || {};

  // region name
  if (name !== undefined) {
    const nameError = validateName(name);
    if (nameError) {
      errors.push(nameError);
    }
  }
  // endregion

  // region password
  if (password !== undefined) {
    const passwordError = validatePassword(password, { name });
    if (passwordError) {
      errors.push(passwordError);
    }
  }
  // endregion

  // region age
  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.push(ageError);
    }
  }
  // endregion

  // region department
  if (department !== undefined) {
    const deptError = validateDepartment(department);
    if (deptError) {
      errors.push(deptError);
    }
  }
  // endregion

  // region phone
  if (phone !== undefined) {
    const phoneError = validatePhone(phone);
    if (phoneError) {
      errors.push(phoneError);
    }
  }
  // endregion

  // region address
  if (address !== undefined) {
    const addressError = validateAddress(address);
    if (addressError) {
      errors.push(addressError);
    }
  }
  // endregion

  // region result
  if (errors?.length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
  // endregion
};
// endregion

// region exports
export { validateUpdateProfile };
// endregion
