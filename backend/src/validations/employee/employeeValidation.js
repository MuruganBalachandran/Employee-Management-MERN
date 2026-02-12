// region imports
//  helpers
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateDepartment,
  validatePhone,
  validateAddress,
  validateEmployeeCode,
  validateJoiningDate,
  validateReportingManager,
  validateSalary,
} from "../helpers/typeValidations.js";
import { validationError } from "../helpers/validationError.js";

//  utils
import { ROLE } from "../../utils/index.js";
// endregion

// region validate create employee
const validateCreateEmployee = (data = {}) => {
  //initialize errors
  const errors = {};

  //extract fields with defaults
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
    reportingManager = "",
    employeeCode = "",
  } = data || {};

  //validate name
  const nameError = validateName(name || "");
  if (nameError) {
    errors.name = nameError;
  }

  //validate email
  const emailError = validateEmail(email || "", ROLE?.EMPLOYEE || "EMPLOYEE");
  if (emailError) {
    errors.email = emailError;
  }

  //validate password
  const passwordError = validatePassword(password || "", {
    Name: name || "",
    Email: email || "",
  });
  if (passwordError) {
    errors.password = passwordError;
  }

  //validate age
  const ageError = validateAge(age);
  if (ageError) {
    errors.age = ageError;
  }

  //validate department
  const deptError = validateDepartment(department || "");
  if (deptError) {
    errors.department = deptError;
  }

  //validate phone
  const phoneError = validatePhone(phone || "");
  if (phoneError) {
    errors.phone = phoneError;
  }

  //validate address
  const addressError = validateAddress(address || {});
  if (addressError) {
    errors.address = addressError;
  }

  //validate salary
  const salaryError = validateSalary(salary || "");
  if (salaryError) {
    errors.salary = salaryError;
  }

  //validate joining date
  const joiningDateError = validateJoiningDate(joiningDate || "");
  if (joiningDateError) {
    errors.joiningDate = joiningDateError;
  }

  //validate reporting manager
  const reportingManagerError = validateReportingManager(
    reportingManager || "",
  );
  if (reportingManagerError) {
    errors.reportingManager = reportingManagerError;
  }

  //validate employee code
  const employeeCodeError = validateEmployeeCode(employeeCode || "");
  if (employeeCodeError) {
    errors.employeeCode = employeeCodeError;
  }

  //return validation error
  if (Object.keys(errors || {}).length > 0) {
    return validationError(errors || {});
  }

  return { isValid: true, error: null };
};
// endregion

// region validate update employee
const validateUpdateEmployee = (data = {}) => {
  //initialize errors
  const errors = {};

  //extract fields
  const {
    name,
    password,
    age,
    department,
    phone,
    address,
    salary,
    reportingManager,
    joiningDate,
  } = data || {};

  //validate name
  if (name !== undefined) {
    const nameError = validateName(name || "");
    if (nameError) {
      errors.name = nameError;
    }
  }

  //validate age
  if (age !== undefined) {
    const ageError = validateAge(age);
    if (ageError) {
      errors.age = ageError;
    }
  }

  //validate department
  if (department !== undefined) {
    const deptError = validateDepartment(department || "");
    if (deptError) {
      errors.department = deptError;
    }
  }

  //validate phone
  if (phone !== undefined) {
    const phoneError = validatePhone(phone || "");
    if (phoneError) {
      errors.phone = phoneError;
    }
  }

  //validate address
  if (address !== undefined) {
    const addressError = validateAddress(address || {});
    if (addressError) {
      errors.address = addressError;
    }
  }

  //validate password
  if (password !== undefined) {
    const passwordError = validatePassword(password || "", {
      Name: name || "",
    });
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  //validate salary
  if (salary !== undefined) {
    const salaryError = validateSalary(salary || "");
    if (salaryError) {
      errors.salary = salaryError;
    }
  }

  //validate joining date
  if (joiningDate !== undefined) {
    const joiningDateError = validateJoiningDate(joiningDate || "");
    if (joiningDateError) {
      errors.joiningDate = joiningDateError;
    }
  }

  //validate reporting manager
  if (reportingManager !== undefined) {
    const reportingManagerError = validateReportingManager(
      reportingManager || "",
    );
    if (reportingManagerError) {
      errors.reportingManager = reportingManagerError;
    }
  }

  //return validation error
  if (Object.keys(errors || {}).length > 0) {
    return validationError(errors || {});
  }

  return { isValid: true, error: null };
};
// endregion

// region exports
export { validateCreateEmployee, validateUpdateEmployee };
// endregion
