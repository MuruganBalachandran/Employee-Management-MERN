// region name validation
export const nameValidation = (name = "") => {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Name is required";
  }

  if (trimmed.length < 3) {
    return "Name must be at least 3 characters";
  }

  if (trimmed.length > 20) {
    return "Name cannot exceed 20 characters";
  }

  return "";
};
// endregion

// region email validation (login supports both roles)
export const emailValidation = (email = "", type = "login") => {
  const trimmed = email.trim();

  if (!trimmed) {
    return "Email is required";
  }

  const regex =
    /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(trimmed)) {
    if (type === "admin") {
      return "Invalid email format (e.g., admin@spanadmin.com)";
    }

    if (type === "employee") {
      return "Invalid email format (e.g., employee@spanemployee.com)";
    }

    return "Invalid email format (e.g., employee@spanemployee.com)";
  }

  const domain = trimmed.split("@")[1] || "";

  if (type === "admin") {
    if (domain !== "spanadmin.com") {
      return "Admin email must end with @spanadmin.com";
    }
  }

  if (type === "employee") {
    if (domain !== "spanemployee.com") {
      return "Employee email must end with @spanemployee.com";
    }
  }

  // type === "login" → allow both
  return "";
};
// endregion

// region password validation
export const passwordValidation = (password = "") => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 128) {
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

  return "";
};
// endregion

// region password rule checker (for live UI)
export const passwordRules = (password = "") => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
};
// endregion
