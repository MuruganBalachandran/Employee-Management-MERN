// region regex constants

// Regex for validating names (letters, diacritics, numbers, spaces, hyphens, apostrophes)
export const NAME_REGEX = /^(?=.*[\p{L}\p{M}])[\p{L}\p{M}\d\s'-]+$/u;

// Regex for validating city/state names (only letters and spaces)
export const CITY_STATE_REGEX = /^[A-Za-z ]{2,50}$/;

// Regex for phone numbers (supports various international formats)
export const PHONE_REGEX =
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

// Regex for ZIP code (5 or 6 digits)
export const ZIP_REGEX = /^\d{5,6}$/;

// Regex for general email validation
export const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

// Regex for employee code (EMP followed by numbers)
export const EMP_CODE_REGEX = /^EMP\d+$/;

// Reserved names not allowed for users
export const RESERVED_NAMES = [
  "admin",
  "root",
  "system",
  "null",
  "undefined",
  "administrator",
  "superuser",
  "moderator",
  "owner",
  "support",
  "help",
  "service",
  "bot",
  "api",
  "test",
  "demo",
  "guest",
  "anonymous",
  "user",
  "default",
  "public",
  "private",
  "internal",
  "external",
];

// Disposable email domains not allowed
export const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwaway.email",
  "mailinator.com",
  "trashmail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "sharklasers.com",
];

// Common typos in email domains to suggest corrections
export const COMMON_DOMAIN_TYPOS = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmil.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

// Common passwords to reject
export const COMMON_PASSWORDS = [
  "password",
  "password123",
  "12345678",
  "qwerty",
  "abc123",
  "monkey",
  "letmein",
  "trustno1",
  "dragon",
  "baseball",
  "iloveyou",
  "master",
  "sunshine",
  "ashley",
  "bailey",
  "passw0rd",
  "shadow",
  "superman",
  "qazwsx",
  "michael",
  "football",
  "welcome",
  "jesus",
  "ninja",
  "mustang",
  "password1",
  "admin",
  "admin123",
  "root",
  "toor",
];

// Valid departments
export const VALID_DEPARTMENTS = [
  "HR",
  "Sales",
  "Marketing",
  "Tester",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Machine Learning",
  "Deep Learning",
  "Network",
  "Cyber Security",
  "DevOps",
];

// endregion

// region name validation
export const nameValidation = (name = "") => {
  // Check type
  if (typeof name !== "string") {
    return "Name must be a string";
  }

  const trimmed = name?.trim() ?? "";

  if (!trimmed) {
    return "Name cannot be empty";
  }

  // Reserved names
  if (RESERVED_NAMES?.includes(trimmed.toLowerCase())) {
    return "This name is reserved";
  }

  // Multiple consecutive spaces
  if (/\s{2,}/.test(trimmed)) {
    return "Name cannot contain multiple consecutive spaces";
  }

  // Special chars at start/end
  if (/^[-']|[-']$/.test(trimmed)) {
    return "Name cannot start or end with special characters";
  }

  if (trimmed.length < 3) {
    return "Name must be at least 3 characters";
  }

  if (trimmed.length > 50) {
    return "Name cannot exceed 50 characters";
  }

  if (!NAME_REGEX?.test(trimmed)) {
    return "Name contains invalid characters";
  }

  return "";
};
// endregion

// region email validation
export const emailValidation = (email = "", type = "employee") => {
  if (typeof email !== "string") {
    return "Email must be a string";
  }

  const trimmed = email?.trim()?.toLowerCase() ?? "";

  if (!trimmed) {
    return "Email cannot be empty";
  }

  if (trimmed.length > 254) {
    return "Email is too long";
  }

  if (!EMAIL_REGEX?.test(trimmed)) {
    return "Invalid email format";
  }

  const domain = trimmed?.split("@")?.[1] ?? "";

  // Disposable domains
  if (DISPOSABLE_DOMAINS?.includes(domain)) {
    return "Disposable email addresses are not allowed";
  }

  // Domain typo suggestion
  if (COMMON_DOMAIN_TYPOS?.[domain]) {
    return `Did you mean ${trimmed?.split("@")?.[0]}@${COMMON_DOMAIN_TYPOS[domain]}?`;
  }

  // Employee domain check
  if (type === "employee") {
    if (domain !== "spanemployee.com") {
      return "Employee email must end with @spanemployee.com";
    }
  }

  return "";
};
// endregion

// region password validation
export const passwordValidation = (password = "") => {
  if (!password) {
    return "Password is required";
  }

  if (password?.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password?.length > 128) {
    return "Password cannot exceed 128 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain a number";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain a special character (!@#$%^&*)";
  }

  const passwordLower = password?.toLowerCase() ?? "";

  // Reject common passwords
  for (const common of COMMON_PASSWORDS ?? []) {
    if (passwordLower?.includes(common)) {
      return "This password is too common";
    }
  }

  // Repeated chars
  if (/(.)\1{2,}/.test(passwordLower)) {
    return "Password cannot contain repeated characters";
  }

  // Sequential chars
  const sequences = [
    "012",
    "123",
    "234",
    "345",
    "456",
    "567",
    "678",
    "789",
    "abc",
    "bcd",
    "cde",
    "def",
  ];
  for (const seq of sequences) {
    if (passwordLower?.includes(seq)) {
      return "Password cannot contain sequential characters";
    }
  }

  return "";
};
// endregion

// region department validation
export const departmentValidation = (department = "") => {
  const dept = department?.trim() ?? "";

  if (!dept) {
    return "Department is required";
  }

  if (!VALID_DEPARTMENTS?.includes(dept)) {
    return "Invalid department";
  }

  return "";
};
// endregion

// region phone validation
export const phoneValidation = (phone = "") => {
  if (typeof phone !== "string") {
    return "Phone must be a string";
  }

  const trimmed = phone?.trim() ?? "";

  if (!trimmed) {
    return "Phone number is required";
  }

  if (!PHONE_REGEX?.test(trimmed)) {
    return "Invalid phone format";
  }

  return "";
};
// endregion

// region address validation
export const addressValidation = (address = {}) => {
  if (typeof address !== "object" || address === null) {
    return { general: "Address must be an object" };
  }

  const errors = {};
  const { line1, line2, city, state, zipCode } = address ?? {};

  // Line1
  if (!line1?.trim()) {
    errors.line1 = "Address Line 1 is required";
  } else if (line1?.trim()?.length < 5) {
    errors.line1 = "Address Line 1 must be at least 5 characters";
  } else if (line1?.trim()?.length > 100) {
    errors.line1 = "Address Line 1 cannot exceed 100 characters";
  }

  // Line2 optional
  if (line2 && line2?.trim()?.length > 100) {
    errors.line2 = "Address Line 2 cannot exceed 100 characters";
  }

  // City
  if (!city?.trim()) {
    errors.city = "City is required";
  } else if (city?.trim()?.length < 2) {
    errors.city = "City must be at least 2 characters";
  } else if (city?.trim()?.length > 50) {
    errors.city = "City cannot exceed 50 characters";
  } else if (!CITY_STATE_REGEX?.test(city?.trim())) {
    errors.city = "City can only contain letters and spaces";
  }

  // State
  if (!state?.trim()) {
    errors.state = "State is required";
  } else if (state?.trim()?.length < 2) {
    errors.state = "State must be at least 2 characters";
  } else if (state?.trim()?.length > 50) {
    errors.state = "State cannot exceed 50 characters";
  } else if (!CITY_STATE_REGEX?.test(state?.trim())) {
    errors.state = "State can only contain letters and spaces";
  }

  // Zip
  if (!zipCode?.trim()) {
    errors.zipCode = "ZIP code is required";
  } else if (!ZIP_REGEX?.test(zipCode?.trim())) {
    errors.zipCode = "ZIP code must be 5 or 6 digits";
  }

  return errors;
};
// endregion

// region age validation
export const ageValidation = (age) => {
  if (age === "" || age === null || age === undefined) return "Age is required";
    
  const num = parseInt(age, 10);

  if (isNaN(num)) {
    return "Age must be a number";
  }

  if (num < 18) {
    return "Age must be at least 18";
  }

  if (num > 65) {
    return "Age must be at most 65";
  }

  return "";
}
// endregion

// region employee code validation
export const employeeCodeValidation = (code = "") => {
  if (!code) return "Employee Code is required";
  if (!EMP_CODE_REGEX.test(code)) {
    return "Employee Code must start with EMP followed by numbers (e.g. EMP123)";
  }
  return "";
}
// endregion

// region salary validation
export const salaryValidation = (salary) => {
  if (salary === "" || salary === null || salary === undefined) return "Salary is required";
  
  const num = parseFloat(salary);
  
  if (isNaN(num)) {
      return "Salary must be a valid number";
  }

  if (num <= 0) {
      return "Salary must be greater than 0";
  }

  if (num > 10000000) {
      return "Salary seems unreasonably high";
  }

  return "";
}
// endregion

// region reporting manager validation
export const reportingManagerValidation = (manager = "") => {
  if (!manager) return "Reporting Manager is required"; 

  const trimmed = manager?.trim() ?? "";

  if (trimmed.length < 2) {
      return "Reporting Manager must be at least 2 characters";
  }

  if (trimmed.length > 50) {
      return "Reporting Manager cannot exceed 50 characters";
  }

  return "";
}
// endregion

// region joining date validation
export const joiningDateValidation = (date = "") => {
  if (!date) return "Joining Date is required";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
      return "Invalid date format";
  }

  // Set today to midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalize input date to midnight
  const inputDate = new Date(dateObj);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
      return "Joining Date must not be in the past";
  }

  return "";
}
// endregion

// region full employee validation
export const validateEmployee = (data = {}, isEdit = false) => {
  const errors = {};

  // Name
  if (!data?.name) {
    errors.name = "Name is required";
  } else {
    const nameErr = nameValidation(data?.name ?? "");
    if (nameErr) {
      errors.name = nameErr;
    }
  }

  // Email & password if creating
  if (!isEdit) {
    if (!data?.email) {
      errors.email = "Email is required";
    } else {
      const emailErr = emailValidation(data?.email ?? "employee", "employee");
      if (emailErr) {
        errors.email = emailErr;
      }
    }

    if (!data?.password) {
      errors.password = "Password is required";
    } else {
      const passErr = passwordValidation(data?.password ?? "");
      if (passErr) {
        errors.password = passErr;
      }

      if ((data?.confirmPassword ?? "") !== (data?.password ?? "")) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
  }

  // Department
  if (!data?.department) {
    errors.department = "Department is required";
  } else {
    const deptErr = departmentValidation(data?.department ?? "");
    if (deptErr) {
      errors.department = deptErr;
    }
  }

  // Phone
  if (!data?.phone) {
    errors.phone = "Phone is required";
  } else {
    const phoneErr = phoneValidation(data?.phone ?? "");
    if (phoneErr) {
      errors.phone = phoneErr;
    }
  }

  // Address
  if (!data?.address || typeof data?.address !== "object") {
    errors["address.line1"] = "Address is required";
  } else {
    const addrErrors = addressValidation(data?.address ?? {});
    Object.keys(addrErrors ?? {}).forEach((key) => {
      errors[`address.${key}`] = addrErrors?.[key];
    });
  }

  // New validations
  // Need to handle hideCredentials? 
  // If isEdit is true, some fields might be editable only by Admin.
  // Assuming frontend passes all current form values.

  // Age
  // But wait, Age is "new field" as per user request. 
  // Should validate unless it's hidden/not provided? 
  // User said "add the age field ... and add validation for everything".
  // So validation should run.
    const ageErr = ageValidation(data?.age);
    if (ageErr) errors.age = ageErr;


  // Employee Code (only for creation?)
  // User said "employee code must be EMP001...".
  // Employee Code is usually immutable on Edit.
  // If user is editing, do we validate it?
  // Only if provided. But my form logic DELETES it from payload on edit.
  // Wait, `validateEmployee` is called BEFORE submission.
  // If `isEdit` is true, typical flow is: don't change Employee Code.
  // But usage in `EmployeeForm`:
  /*
    const errors = validateEmployee(form, isEdit);
  */
  // Form has `employeeCode` in state.
  // If `isEdit`, `employeeCode` is disabled in UI.
  // But we can still validate it exists.
  // For Create (`!isEdit`), MUST validate format.
  if (!isEdit) {
      const codeErr = employeeCodeValidation(data?.employeeCode);
      if (codeErr) errors.employeeCode = codeErr;
  }

  // Salary
  const salaryErr = salaryValidation(data?.salary);
  if (salaryErr) errors.salary = salaryErr;

  // Reporting Manager
  const managerErr = reportingManagerValidation(data?.reportingManager);
  if (managerErr) errors.reportingManager = managerErr;

  // Joining Date
  const dateErr = joiningDateValidation(data?.joiningDate);
  if (dateErr) errors.joiningDate = dateErr;

  return errors;
};
// endregion
