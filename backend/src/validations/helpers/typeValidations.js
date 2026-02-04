// region imports
import { mongoose, isValidObjectId } from "mongoose";
import { VALIDATION_MESSAGES, ROLE } from "../../utils/index.js";
// endregion

// region general validation utilities
const isEmpty = (value) => {
  if (value === undefined || value === null) return true;
  if (value === "") return true;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const isFalsyOrInvalid = (value) => {
  // Explicit falsy checks
  if (value === undefined || value === null) return true;
  if (value === "" || value === false) return true;
  if (typeof value === "number" && (value === 0 || isNaN(value))) return true;

  // Empty object check
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }

  // Empty array check
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

const validateRequired = (
  value,
  fieldName = "Field",
  expectedType = "string",
) => {
  // Check for falsy/invalid values
  if (isFalsyOrInvalid(value)) {
    return `${fieldName} is required`;
  }

  // Type check
  const actualType = Array.isArray(value) ? "array" : typeof value;
  if (actualType !== expectedType) {
    return `${fieldName} must be a ${expectedType}`;
  }

  return null;
};
// endregion

// region name rules
const NAME_REGEX = /^(?=.*[\p{L}\p{M}])[\p{L}\p{M}\d\s'-]+$/u; // Support Unicode letters & numbers, but at least one letter required
const RESERVED_NAMES = [
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
// endregion

// region validate Name
const validateName = (value = "") => {
  // Use general validation utility for falsy check
  if (isFalsyOrInvalid(value)) {
    return VALIDATION_MESSAGES?.NAME_REQUIRED || "Name is required";
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== "string") {
    return VALIDATION_MESSAGES?.NAME_STRING || "Name must be a string";
  }

  // NORMALIZE AFTER TYPE IS CONFIRMED
  const name = value?.trim?.() || "";

  // EMPTY STRING CHECK after trimming
  if (name?.length === 0) {
    return VALIDATION_MESSAGES?.NAME_EMPTY || "Name cannot be empty";
  }

  // RESERVED WORD CHECK (business rule)
  if (RESERVED_NAMES?.includes?.(name?.toLowerCase?.())) {
    return VALIDATION_MESSAGES?.NAME_RESERVED || "This name is reserved";
  }

  // EXCESSIVE SPACES CHECK
  if (/\s{2,}/.test(name)) {
    return (
      VALIDATION_MESSAGES?.NAME_SPACES ||
      "Name cannot contain multiple consecutive spaces"
    );
  }

  // LEADING/TRAILING SPECIAL CHARS CHECK
  if (/^[-']|[-']$/.test(name)) {
    return (
      VALIDATION_MESSAGES?.NAME_SPECIAL_START ||
      "Name cannot start or end with special characters"
    );
  }

  // PATTERN CHECK - allow international characters
  if (!NAME_REGEX.test(name)) {
    return (
      VALIDATION_MESSAGES?.NAME_PATTERN || "Name contains invalid characters"
    );
  }

  // MINIMUM WORD LENGTH CHECK
  const words = name?.split?.(/\s+/) || [];
  if (words?.some?.((w) => (w?.length || 0) < 1)) {
    return (
      VALIDATION_MESSAGES?.NAME_WORD_LENGTH ||
      "Each part of the name must be at least 2 characters"
    );
  }

  // LENGTH CHECK (last)
  if (name?.length < 3 || name?.length > 50) {
    return (
      VALIDATION_MESSAGES?.NAME_LENGTH_INVALID || "Name must be 3–50 characters"
    );
  }

  return null;
};
// endregion

// region email rules
const DISPOSABLE_DOMAINS = [
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

const COMMON_DOMAIN_TYPOS = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmil.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "outlok.com": "outlook.com",
};
// endregion

// region validate Email
const validateEmail = (value = "") => {
  // Use general validation utility for falsy check
  if (isFalsyOrInvalid(value)) {
    return VALIDATION_MESSAGES?.EMAIL_REQUIRED || "Email is required";
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== "string") {
    return VALIDATION_MESSAGES?.EMAIL_STRING || "Email must be a string";
  }

  // NORMALIZE
  const email = value?.trim?.()?.toLowerCase?.() || "";

  // EMPTY STRING CHECK after trimming
  if (email?.length === 0) {
    return VALIDATION_MESSAGES?.EMAIL_EMPTY || "Email cannot be empty";
  }

  // MAX LENGTH CHECK (RFC 5321)
  if (email?.length > 254) {
    return VALIDATION_MESSAGES?.EMAIL_LONG || "Email is too long";
  }

  // FORMAT CHECK - more comprehensive regex
  const emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  if (!emailRegex.test(email)) {
    return VALIDATION_MESSAGES?.EMAIL_FORMAT || "Invalid email format";
  }

  // EXTRACT DOMAIN
  const domain = email?.split?.("@")?.[1] ?? "";

  // DISPOSABLE EMAIL CHECK
  if (DISPOSABLE_DOMAINS?.includes?.(domain)) {
    return (
      VALIDATION_MESSAGES?.EMAIL_DISPOSABLE ||
      "Disposable email addresses are not allowed"
    );
  }

  // COMMON TYPO CHECK
  if (COMMON_DOMAIN_TYPOS?.[domain]) {
    const suggestedEmail = `${email?.split?.("@")?.[0] || ""}@${COMMON_DOMAIN_TYPOS[domain]}`;
    return (
      (
        VALIDATION_MESSAGES?.EMAIL_TYPO_SUGGESTION || "Did you mean {email}?"
      )?.replace?.("{email}", suggestedEmail) || "Check for domain typos"
    );
  }

  return null;
};
// endregion

// endregion

// region validate Email Domain
const validateEmailDomain = ({ email = "", role = "employee" }) => {
  if (!email) return null; // content presence checked elsewhere

  const domain = email.split("@")[1]?.toLowerCase();

  if (role === ROLE.SUPER_ADMIN || role === ROLE.ADMIN) {
    if (domain !== "spanadmin.com") {
      return `Admins must use @spanadmin.com email addresses`;
    }
  } else if (role === ROLE.EMPLOYEE) {
    if (domain !== "spanemployee.com") {
      return `Employees must use @spanemployee.com email addresses`;
    }
  }

  return null;
};
// endregion

// region password rules
const COMMON_PASSWORDS = [
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
// endregion

// region validate Password
const validatePassword = (value = "", context = {}) => {
  // Use general validation utility for falsy check
  if (isFalsyOrInvalid(value)) {
    return VALIDATION_MESSAGES?.PASSWORD_REQUIRED || "Password is required";
  }

  // STRICT TYPE CHECK - prevent type coercion
  if (typeof value !== "string") {
    return VALIDATION_MESSAGES?.PASSWORD_STRING || "Password must be a string";
  }

  // DO NOT TRIM PASSWORD - preserve intentional spaces
  const password = value || "";

  // EMPTY STRING CHECK
  if (password?.length === 0) {
    return VALIDATION_MESSAGES?.PASSWORD_EMPTY || "Password cannot be empty";
  }

  // LENGTH CHECKS
  if (password?.length < 8) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_MIN_LENGTH ||
      "Password must be at least 8 characters"
    );
  }

  if (password?.length > 128) {
    return VALIDATION_MESSAGES?.PASSWORD_MAX_LENGTH || "Password is too long";
  }

  // COMPLEXITY RULES - require all character types
  if (!/[a-z]/.test(password)) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_LOWERCASE ||
      "Password must contain a lowercase letter"
    );
  }

  if (!/[A-Z]/.test(password)) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_UPPERCASE ||
      "Password must contain an uppercase letter"
    );
  }

  if (!/\d/.test(password)) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_NUMBER || "Password must contain a number"
    );
  }

  if (!/[@$!%*?&#^()_+=\-\[\]{}|\\:;"'<>,.\/]/.test(password)) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_SPECIAL ||
      "Password must contain a special character"
    );
  }

  // COMMON PASSWORD CHECK
  const passwordLower = password?.toLowerCase?.() || "";
  for (const common of COMMON_PASSWORDS) {
    if (passwordLower?.includes?.(common)) {
      return (
        VALIDATION_MESSAGES?.PASSWORD_COMMON || "This password is too common"
      );
    }
  }

  // REPEATED CHARACTERS CHECK
  if (/(.)\1{2,}/.test(password)) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_REPEAT ||
      "Password cannot contain repeated characters"
    );
  }

  // SEQUENTIAL CHARACTERS CHECK
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
    if (passwordLower?.includes?.(seq)) {
      return (
        VALIDATION_MESSAGES?.PASSWORD_SEQUENCE ||
        "Password cannot contain sequential characters"
      );
    }
  }

  // CONTEXT CHECKS (SAFE) - prevent password containing user info
  const nameSafe =
    typeof context?.Name === "string"
      ? context?.Name?.toLowerCase?.()?.trim?.() || ""
      : null;
  const emailSafe =
    typeof context?.Email === "string"
      ? context?.Email?.toLowerCase?.()?.split?.("@")?.[0] || ""
      : null;

  if (
    nameSafe &&
    nameSafe?.length >= 3 &&
    passwordLower?.includes?.(nameSafe)
  ) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_NAME_CONTAIN ||
      "Password cannot contain your name"
    );
  }

  if (
    emailSafe &&
    emailSafe?.length >= 3 &&
    passwordLower?.includes?.(emailSafe)
  ) {
    return (
      VALIDATION_MESSAGES?.PASSWORD_EMAIL_CONTAIN ||
      "Password cannot contain your email username"
    );
  }

  return null;
};
// endregion

// region validate Age
const validateAge = (value) => {
  // FALSY VALUE CHECK - but allow 0 as valid age (though unrealistic)
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === false
  ) {
    return VALIDATION_MESSAGES?.AGE_REQUIRED || "Age is required";
  }

  // STRICT TYPE CHECK - prevent type coercion from strings
  if (typeof value !== "number") {
    return VALIDATION_MESSAGES?.AGE_STRING || "Age must be a number";
  }

  // NaN CHECK
  if (Number?.isNaN?.(value)) {
    return VALIDATION_MESSAGES?.AGE_VALID || "Age must be a valid number";
  }

  // INFINITY CHECK
  if (!Number?.isFinite?.(value)) {
    return VALIDATION_MESSAGES?.AGE_FINITE || "Age must be a finite number";
  }

  // INTEGER CHECK
  if (!Number?.isInteger?.(value)) {
    return VALIDATION_MESSAGES?.AGE_WHOLE || "Age must be a whole number";
  }

  // MINIMUM AGE CHECK (COPPA compliance - 13 years)
  if (value < 10) {
    return VALIDATION_MESSAGES?.AGE_MIN || "You must be at least 10 years old";
  }

  // MAXIMUM AGE CHECK (realistic limit)
  if (value > 120) {
    return VALIDATION_MESSAGES?.AGE_MAX || "Please enter a valid age";
  }

  return null;
};
// endregion

// region validate Role
const validateRole = (value = "employee") => {
  //  REQUIRED
  if (value === undefined || value === null) {
    return VALIDATION_MESSAGES?.ROLE_REQUIRED || "Role is required";
  }

  //  TYPE CHECK
  if (typeof value !== "string") {
    return VALIDATION_MESSAGES?.ROLE_STRING || "Role must be a string";
  }

  //  ALLOWED VALUES
  const allowed = [ROLE.SUPER_ADMIN, ROLE.ADMIN, ROLE.EMPLOYEE];
  if (!allowed?.includes?.(value)) {
    return VALIDATION_MESSAGES?.ROLE_INVALID || "Invalid role";
  }

  return null;
};

/**
 * Validates Department name.
 */
const validateDepartment = (value = "") => {
  if (!value || value?.trim?.()?.length === 0) {
    return VALIDATION_MESSAGES?.DEPARTMENT_REQUIRED || "Department is required";
  }
  if (typeof value !== "string") {
    return (
      VALIDATION_MESSAGES?.DEPARTMENT_STRING || "Department must be a string"
    );
  }
  return null;
};

/**
 * Validates Phone number. (Basic format check)
 */
const validatePhone = (value = "") => {
  if (!value || value?.trim?.()?.length === 0) {
    return VALIDATION_MESSAGES?.PHONE_REQUIRED || "Phone number is required";
  }
  if (typeof value !== "string") {
    return VALIDATION_MESSAGES?.PHONE_STRING || "Phone number must be a string";
  }
  // Basic regex for phone (digits, spaces, plus, hyphens)
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(value.trim())) {
    return VALIDATION_MESSAGES?.PHONE_FORMAT || "Invalid phone format";
  }
  return null;
};

/**
 * Validates Address object.
 * Expects camelCase fields from API: line1, city, state, zipCode
 */
const validateAddress = (value = {}) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return VALIDATION_MESSAGES?.ADDRESS_REQUIRED || "Address is required";
  }

  const { line1, city, state, zipCode } = value;

  if (!line1 || line1?.trim?.()?.length === 0) {
    return (
      VALIDATION_MESSAGES?.ADDRESS_LINE1_REQUIRED ||
      "Address line 1 is required"
    );
  }
  if (!city || city?.trim?.()?.length === 0) {
    return VALIDATION_MESSAGES?.CITY_REQUIRED || "City is required";
  }
  if (!state || state?.trim?.()?.length === 0) {
    return VALIDATION_MESSAGES?.STATE_REQUIRED || "State is required";
  }
  if (!zipCode || zipCode?.trim?.()?.length === 0) {
    return VALIDATION_MESSAGES?.ZIPCODE_REQUIRED || "Zip code is required";
  }

  return null;
};
// endregion

// region validate ObjectId
/**
 * Validates MongoDB ObjectId strings.
 */
const validateObjectId = (value = "") => {
  // Use general validation utility for falsy check
  if (isFalsyOrInvalid(value)) {
    return "ID is required";
  }
  if (!isValidObjectId(value)) {
    return "Invalid object id";
  }
  return null;
};
// endregion

// region exports
export {
  validateName,
  validateEmail,
  validatePassword,
  validateAge,
  validateRole,
  validateObjectId,
  validateDepartment,
  validatePhone,
  validateAddress,
  validateEmailDomain,
};
// endregion
