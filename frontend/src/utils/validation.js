import {
  NAME_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  ZIP_REGEX,
  EMPLOYEE_CODE_REGEX,
  ADMIN_CODE_REGEX,
  REPORTING_MANAGER_REGEX,
  SALARY_REGEX,
} from "./constants";

// =====================
// SINGLE FIELD VALIDATION
// =====================
export const validateField = (
  name,
  value,
  role = "EMPLOYEE",
  asyncCheck = null,
) => {
  const v = value?.toString()?.trim() || "";

  switch (name) {
    case "name":
      if (!v) return "Name is required";
      if (/\s{2,}/.test(v))
        return "Name cannot contain multiple consecutive spaces";
      if (/^[-']|[-']$/.test(v))
        return "Name cannot start or end with special characters";
      if (!NAME_REGEX.test(v)) return "Name contains invalid characters";
      if (v.length < 3 || v.length > 50) return "Name must be 3–50 characters";
      return "";

    case "email":
      if (!v) return "Email is required";
      if (!EMAIL_REGEX.test(v)) return "Invalid email address";

      const domain = v.split("@")[1]?.toLowerCase();
      if (role === "ADMIN" && domain !== "spanadmin.com") {
        return "Admins must use @spanadmin.com email addresses";
      }
      if (role === "EMPLOYEE" && domain !== "spanemployee.com") {
        return "Employees must use @spanemployee.com email addresses";
      }

      if (asyncCheck && typeof asyncCheck === "function") {
        return asyncCheck(name, v);
      }
      return "";

    case "password":
      if (!v) return "Password is required";
      if (v.length < 8) return "Password must be at least 8 characters";
      if (!/[a-z]/.test(v)) return "Password must contain a lowercase letter";
      if (!/[A-Z]/.test(v)) return "Password must contain an uppercase letter";
      if (!/\d/.test(v)) return "Password must contain a number";
      if (!/[@$!%*?&#^()_+=\-]/.test(v))
        return "Password must contain a special character";
      return "";

    case "confirmPassword":
      return "";

    case "age":
      if (!v) return "Age is required";
      const age = Number(v);
      if (isNaN(age) || age < 18 || age > 65)
        return "Age must be between 18 and 65";
      return "";

    case "phone":
      if (!v) return "Phone number is required";
      if (!PHONE_REGEX.test(v)) return "Invalid phone format";
      return "";

    case "employeeCode":
      if (role === "EMPLOYEE") {
        if (!v) return "Employee code is required";
        if (!EMPLOYEE_CODE_REGEX.test(v.toUpperCase()))
          return "Format: EMP followed by 3–7 digits";
        if (asyncCheck && typeof asyncCheck === "function") {
          return asyncCheck(name, v);
        }
      }
      return "";

    case "adminCode":
      if (role === "ADMIN") {
        if (!v) return "Admin code is required";
        if (!ADMIN_CODE_REGEX.test(v.toUpperCase()))
          return "Format: ADMIN followed by 2–6 digits";
        if (asyncCheck && typeof asyncCheck === "function") {
          return asyncCheck(name, v);
        }
      }
      return "";

    case "reportingManager":
      if (role === "EMPLOYEE") {
        if (!v) return "Reporting manager is required";
        if (!REPORTING_MANAGER_REGEX.test(v)) return "Invalid manager name";
      }
      return "";

    case "salary":
      if (!v) return "Salary is required";
      if (!SALARY_REGEX.test(v)) return "Invalid salary amount";
      return "";

    case "joiningDate":
      if (!v) return "Joining date is required";
      return "";

    case "address.line1":
      if (!v) return "Address line 1 is required";
      return "";

    case "address.city":
      if (!v) return "City is required";
      return "";

    case "address.state":
      if (!v) return "State is required";
      return "";

    case "address.zipCode":
      if (!v) return "Zip code is required";
      if (!ZIP_REGEX.test(v)) return "Invalid zip code";
      return "";

    default:
      return "";
  }
};

// =====================
// FORM VALIDATION
// =====================
export const validateForm = (
  formData = {},
  role = "EMPLOYEE",
  isEdit = false,
) => {
  const errors = {};

  // ---- BASE (CREATE + EDIT) ----
  const fieldsToValidate = [
    "name",
    "age",
    "phone",
    "salary",
    "address.line1",
    "address.city",
    "address.state",
    "address.zipCode",
  ];

  // ---- EMPLOYEE ONLY ----
  if (role === "EMPLOYEE") {
    fieldsToValidate.push("reportingManager");
  }

  // ---- CREATE ONLY ----
  if (!isEdit) {
    fieldsToValidate.push(
      "email",
      "joiningDate",
      "password",
      role === "ADMIN" ? "adminCode" : "employeeCode",
    );
  }

  // ---- RUN VALIDATION ----
  fieldsToValidate.forEach((field) => {
    const value = field.includes(".")
      ? formData[field.split(".")[0]]?.[field.split(".")[1]]
      : formData[field];

    const error = validateField(field, value, role, null);
    if (error) errors[field] = error;
  });

  // ---- PASSWORD CONFIRM (CREATE ONLY) ----
  if (!isEdit) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};
