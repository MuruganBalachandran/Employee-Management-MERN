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
  validateObjectId,
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { VALIDATION_MESSAGES, ROLE } from "../../utils/index.js";
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

  // Employee Code
  if (!employeeCode || typeof employeeCode !== 'string' || !employeeCode.trim()) {
    errors.employeeCode = "Employee Code is required";
  } else if (!/^EMP\d+$/.test(employeeCode)) {
    errors.employeeCode = "Employee Code must start with EMP followed by numbers (e.g. EMP123)";
  }

  // Salary
  if (salary === undefined || salary === null || salary === "") {
    errors.salary = "Salary is required";
  } else if (typeof salary !== 'number' || isNaN(salary)) {
    errors.salary = "Salary must be a number";
  } else if (salary <= 0) {
    errors.salary = "Salary must be greater than 0";
  }

  // Reporting Manager (name/ID)
  if (!reportingManager || (typeof reportingManager === 'string' && !reportingManager.trim())) {
    errors.reportingManager = "Reporting Manager is required";
  }

  // Joining Date
  if (!joiningDate) {
    errors.joiningDate = "Joining Date is required";
  } else if (isNaN(Date.parse(joiningDate))) {
    errors.joiningDate = "Invalid joining date";
  } else {
    // Check if past
    const date = new Date(joiningDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0); // Normalize input date if it's YYYY-MM-DD
    if (date < today) {
      errors.joiningDate = "Joining Date must not be in the past";
    }
  }

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

  // Validate additional fields if provided
  const { salary, joiningDate, reportingManager, employeeCode } = data;

  if (employeeCode !== undefined) {
    if (!employeeCode || typeof employeeCode !== 'string' || !employeeCode.trim()) {
      errors.employeeCode = "Employee Code cannot be empty";
    } else if (!/^EMP\d+$/.test(employeeCode)) {
      errors.employeeCode = "Employee Code must start with EMP followed by numbers (e.g. EMP123)";
    }
  }

  if (salary !== undefined) {
    if (salary === null || salary === "") {
        errors.salary = "Salary is required";
    } else if (typeof salary !== 'number' || isNaN(salary)) {
        errors.salary = "Salary must be a number";
    } else if (salary <= 0) {
        errors.salary = "Salary must be greater than 0";
    }
  }

  if (reportingManager !== undefined) {
     if (!reportingManager || (typeof reportingManager === 'string' && !reportingManager.trim())) {
        errors.reportingManager = "Reporting Manager cannot be empty";
     }
  }

  if (joiningDate !== undefined) {
    if (!joiningDate) {
        errors.joiningDate = "Joining Date cannot be empty";
    } else if (isNaN(Date.parse(joiningDate))) {
        errors.joiningDate = "Invalid joining date";
    } else {
        const date = new Date(joiningDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        if (date < today) {
            errors.joiningDate = "Joining Date must not be in the past";
        }
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
