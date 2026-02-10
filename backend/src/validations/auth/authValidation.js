// region imports
import {
  validateEmail,
  validatePassword,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { VALIDATION_MESSAGES } from "../../utils/index.js";
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
export { validateLogin };
// endregion
