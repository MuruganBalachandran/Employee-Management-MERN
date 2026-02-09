// region name validation
// Validates user name with length and content checks
export const nameValidation = (name = "") => {
  // Trim whitespace safely
  const trimmed = name?.trim() ?? "";

  // Check if name is empty
  if (!trimmed) {
    return "Name is required";
  }

  // Check minimum length
  if (trimmed?.length < 3) {
    return "Name must be at least 3 characters";
  }

  // Check maximum length
  if (trimmed?.length > 20) {
    return "Name cannot exceed 20 characters";
  }

  return "";
};
// endregion

// region email validation (login supports both roles)
// Validates email format and domain based on user type
export const emailValidation = (email = "", type = "login") => {
  // Trim whitespace safely
  const trimmed = email?.trim() ?? "";

  // Check if email is empty
  if (!trimmed) {
    return "Email is required";
  }

  // Email format regex
  const regex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validate email format
  if (!regex?.test(trimmed)) {
    if (type === "admin") {
      return "Invalid email (e.g., admin@spanadmin.com)";
    }

    if (type === "employee") {
      return "Invalid email (e.g., employee@spanemployee.com)";
    }

    return "Invalid email (e.g., xx@span[role].com)";
  }

  // Extract domain safely
  const domain = trimmed?.split("@")?.[1] ?? "";

  // Validate admin domain
  if (type === "admin") {
    if (domain !== "spanadmin.com") {
      return "Admin email must end with @spanadmin.com";
    }
  }

  // Validate employee domain
  if (type === "employee") {
    if (domain !== "spanemployee.com") {
      return "Employee email must end with @spanemployee.com";
    }
  }

  // type === "login" → allow both domains
  return "";
};
// endregion

// region password validation
// Validates password strength with multiple requirements
export const passwordValidation = (password = "") => {
  // Check if password is empty
  if (!password) {
    return "Password is required";
  }

  // Check minimum length
  if (password?.length < 8) {
    return "Password must be at least 8 characters";
  }

  // Check maximum length
  if (password?.length > 128) {
    return "Password cannot exceed 128 characters";
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter";
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter";
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return "Password must contain a number";
  }

  // Check for special character
  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain a special character (!@#$%^&*)";
  }

  return "";
};
// endregion

// region password rule checker (for live UI)
// Returns object with boolean flags for each password requirement
export const passwordRules = (password = "") => {
  return {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password ?? ""),
    lowercase: /[a-z]/.test(password ?? ""),
    number: /[0-9]/.test(password ?? ""),
    special: /[!@#$%^&*]/.test(password ?? ""),
  };
};
// endregion
