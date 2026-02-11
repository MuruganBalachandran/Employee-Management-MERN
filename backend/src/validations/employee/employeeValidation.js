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
  validateEmployeeCode,
  validateJoiningDate,
  validateReportingManager,
  validateSalary
} from "../helpers/typeValidations.js";

import { validationError } from "../helpers/validationError.js";
import { ROLE } from "../../utils/index.js";
// endregion

// region validate create employee
const validateCreateEmployee = (data = {}) => {
  const errors = {};

  const {
    name="",
    email="",
    password="",
    age=0,
    department="",
    phone="",
    address={},
    salary="",
    joiningDate="",
    reportingManager="",
    employeeCode="",
  } = data;

  // Existing validations
  const nameError = validateName(name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError =
    validateEmail(email) || validateEmailDomain({ email, role: ROLE.EMPLOYEE });
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password, {
    Name: name,
    Email: email,
  });
  if (passwordError) {
    errors.password = passwordError;
  }

  const ageError = validateAge(age);
  if (ageError) {
    errors.age = ageError;
  }

  const deptError = validateDepartment(department);
  if (deptError) {
    errors.department = deptError;
  }

  const phoneError = validatePhone(phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  const addressError = validateAddress(address);
  if (addressError) {
    errors.address = addressError;
  }

  // New validations
  const salaryError = validateSalary(salary);
  if (salaryError) {
    errors.salary = salaryError;
  }

  const joiningDateError = validateJoiningDate(joiningDate);
  if (joiningDateError) {
    errors.joiningDate = joiningDateError;
  }

  const reportingManagerError = validateReportingManager(reportingManager);
  if (reportingManagerError) {
    errors.reportingManager = reportingManagerError;
  }

  const employeeCodeError = validateEmployeeCode(employeeCode);
  if (employeeCodeError) {
    errors.employeeCode = employeeCodeError;
  }

  if (Object.keys(errors).length > 0) return validationError(errors);

  return { isValid: true, error: null };
};

// endregion
// region validate update employee
const validateUpdateEmployee = (data = {}) => {
  const errors = {};

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

  // Validate each field only if provided
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

  if (password !== undefined) {
    const passwordError = validatePassword(password, { Name: name });
    if (passwordError) errors.password = passwordError;
  }

  if (salary !== undefined) {
    const salaryError = validateSalary(salary);
    if (salaryError) errors.salary = salaryError;
  }

  if (joiningDate !== undefined) {
    const joiningDateError = validateJoiningDate(joiningDate);
    if (joiningDateError) errors.joiningDate = joiningDateError;
  }

  if (reportingManager !== undefined) {
    const reportingManagerError = validateReportingManager(reportingManager);
    if (reportingManagerError) errors.reportingManager = reportingManagerError;
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
