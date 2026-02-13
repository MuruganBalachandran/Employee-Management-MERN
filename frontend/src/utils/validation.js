import {
  NAME_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  ZIP_REGEX,
  EMPLOYEE_CODE_REGEX,
  ADMIN_CODE_REGEX,
  REPORTING_MANAGER_REGEX,
  SALARY_REGEX,
  VALID_DEPARTMENTS,
} from "./constants";

// SINGLE FIELD VALIDATION
export const validateField = (name, value, role = "EMPLOYEE") => {
  const v = value?.toString()?.trim() ?? "";

  switch (name) {
    //  NAME
    case "name": {
      if (!v) return "Name is required";

      if (/\s{2,}/.test(v))
        return "Name cannot contain multiple consecutive spaces";

      if (/^[-']|[-']$/.test(v))
        return "Name cannot start or end with special characters";

      // Unicode letters, digits, spaces, apostrophe, hyphen
      const NAME_REGEX = /^(?=.*[\p{L}\p{M}])[\p{L}\p{M}\d\s'-]+$/u;
      if (!NAME_REGEX.test(v)) return "Name contains invalid characters";

      const words = v.split(/\s+/);
      if (words.some((w) => w.length < 2))
        return "Each part of the name must be at least 2 characters";

      if (v.length < 3 || v.length > 50) return "Name must be 3–50 characters";

      return "";
    }

    //  EMAIL
    case "email": {
      if (!v) return "Email is required";
      if (!EMAIL_REGEX.test(v)) return "Invalid email address";

      const domain = v.split("@")[1]?.toLowerCase();
      if (role === "ADMIN" && domain !== "spanadmin.com")
        return "Admins must use @spanadmin.com email addresses";

      if (role === "EMPLOYEE" && domain !== "spanemployee.com")
        return "Employees must use @spanemployee.com email addresses";

      return "";
    }

    //  PASSWORD
    case "password": {
      if (!v) return "Password is required";
      if (v.length < 8) return "Password must be at least 8 characters";
      if (v.length > 128) return "Password is too long";
      if (!/[a-z]/.test(v)) return "Password must contain a lowercase letter";
      if (!/[A-Z]/.test(v)) return "Password must contain an uppercase letter";
      if (!/\d/.test(v)) return "Password must contain a number";
      if (!/[@$!%*?&#^()_+=\-]/.test(v))
        return "Password must contain a special character";

      if (/(.)\1{2,}/.test(v))
        return "Password cannot contain repeated characters";

      return "";
    }

    //  AGE
    case "age": {
      if (!v) return "Age is required";
      const age = Number(v);

      if (!Number.isInteger(age)) return "Age must be a whole number";

      if (age < 18 || age > 65) return "Age must be between 18 and 65";

      return "";
    }

    //  PHONE
    case "phone": {
      if (!v) return "Phone number is required";
      if (!PHONE_REGEX.test(v)) return "Invalid phone format";
      return "";
    }

    //  EMPLOYEE CODE
    case "employeeCode": {
      if (role !== "EMPLOYEE") return "";
      if (!v) return "Employee code is required";
      if (!EMPLOYEE_CODE_REGEX.test(v.toUpperCase()))
        return "Format: EMP followed by 3–7 digits";
      return "";
    }

    //  ADMIN CODE
    case "adminCode": {
      if (role !== "ADMIN") return "";
      if (!v) return "Admin code is required";
      if (!ADMIN_CODE_REGEX.test(v.toUpperCase()))
        return "Format: ADMIN followed by 2–6 digits";
      return "";
    }

    //  SALARY
    case "salary": {
      if (!v) return "Salary is required";
      if (!SALARY_REGEX.test(v))
        return "Salary must be a valid non-negative number";
      return "";
    }

    //  JOINING DATE
    case "joiningDate": {
      if (!v) return "Joining date is required";
      // expects YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Joining date must be valid";
      return "";
    }

    //  ADDRESS
    case "address.line1":
      return v ? "" : "Address line 1 is required";
    case "address.city":
      return v ? "" : "City is required";
    case "address.state":
      return v ? "" : "State is required";
    case "address.zipCode":
      if (!v) return "Zip code is required";
      if (!ZIP_REGEX.test(v)) return "Invalid zip code";
      return "";

    //  DEPARTMENT
    case "department": {
      if (role !== "EMPLOYEE") return "";

      if (!v) return "Department is required";

      if (typeof value !== "string") return "Department must be a valid string";

      const department = v.trim();

      if (!VALID_DEPARTMENTS.includes(department))
        return "Please select a valid department";

      return "";
    }

    //  REPORTING MANAGER
    case "reportingManager": {
      if (role !== "EMPLOYEE") return "";

      if (!v) return "Reporting manager is required";

      if (!REPORTING_MANAGER_REGEX.test(v))
        return "Invalid reporting manager name";

      return "";
    }

    default:
      return "";
  }
};

// FORM VALIDATION
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
    fieldsToValidate.push("department", "reportingManager");
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
