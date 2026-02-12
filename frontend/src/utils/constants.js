// region regex constants

// Regex for validating names (letters, diacritics, numbers, spaces, hyphens, apostrophes)
export const NAME_REGEX = /^(?=.*[\p{L}\p{M}])[\p{L}\p{M}\d\s'-]+$/u;

// Regex for validating city/state names (only letters and spaces)
export const CITY_STATE_REGEX = /^[A-Za-z ]{2,50}$/;

// Regex for phone numbers (supports various international formats)
export const PHONE_REGEX = /^[+]?[0-9]{10,15}$/;

// Regex for ZIP code (5 or 6 digits)
export const ZIP_REGEX = /^\d{5,6}$/;

// Regex for general email validation
export const EMAIL_REGEX =
  /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?$/i;

  // EMP followed by 3 - 7 digitis
export const EMPLOYEE_CODE_REGEX = /^EMP\d{3,7}$/;

// reporting manager
export const REPORTING_MANAGER_REGEX = /^[\p{L}\p{M}\s'-]{3,50}$/u;

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


// Common passwords to reject
export const COMMON_PASSWORDS = [
  "password",
  "Password@123",
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
  "Administration",
];
// endregion
