// region imports
import {
  validateName,
  validateEmail,
  validatePassword,
  validateEmailDomain,
} from "../helpers/typeValidations.js";
import { validationError } from "../helpers/validationError.js";
// endregion

// region validate create admin
const validateCreateAdmin = (data = {}) => {
  const errors = {};

  const { name = "", email = "", password = "" } = data || {};

  const nameError = validateName(name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  } else {
    // Only check domain if email format is valid
    const domainError = validateEmailDomain({ email, role: 'ADMIN' });
    if (domainError) {
      errors.email = domainError;
    }
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  if (Object.keys(errors).length > 0) {
    return validationError(errors);
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateCreateAdmin };
// endregion
