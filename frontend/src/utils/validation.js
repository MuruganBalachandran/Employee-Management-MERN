import {
    NAME_REGEX,
    EMAIL_REGEX,
    PHONE_REGEX,
    ZIP_REGEX,
    EMPLOYEE_CODE_REGEX,
    ADMIN_CODE_REGEX,
    REPORTING_MANAGER_REGEX,
    SALARY_REGEX
} from "./constants";

/**
 * Validates a single field based on name and value
 * @param {string} name - Field name
 * @param {any} value - Field value
 * @param {string} role - User role (ADMIN/EMPLOYEE)
 * @param {Function} asyncCheck - Optional async validation function
 * @returns {string|Promise<string>} - Error message or empty string
 */
export const validateField = (name, value, role = "EMPLOYEE", asyncCheck = null) => {
    const v = value?.toString()?.trim() || "";

    switch (name) {
        case "name":
            if (!v) return "Name is required";
            if (/\s{2,}/.test(v)) return "Name cannot contain multiple consecutive spaces";
            if (/^[-']|[-']$/.test(v)) return "Name cannot start or end with special characters";
            if (!NAME_REGEX.test(v)) return "Name contains invalid characters";
            const parts = v.split(/\s+/);
            if (parts.some(p => p.length < 2)) return "Each part of the name must be at least 2 characters";
            if (v.length < 3 || v.length > 50) return "Name must be 3–50 characters";
            return "";

        case "email":
            if (!v) return "Email is required";
            if (!EMAIL_REGEX.test(v)) return "Invalid email address";
            const domain = v.split("@")[1]?.toLowerCase();
            if ((role === "ADMIN" || role === "SUPER_ADMIN") && domain !== "spanadmin.com") {
                return "Admins must use @spanadmin.com email addresses";
            }
            if (role === "EMPLOYEE" && domain !== "spanemployee.com") {
                return "Employees must use @spanemployee.com email addresses";
            }
            // Async check for duplicate email
            if (asyncCheck && typeof asyncCheck === 'function') {
                return asyncCheck(name, v);
            }
            return "";

        case "password":
            if (!v) return "Password is required";
            if (v.length < 8) return "Password must be at least 8 characters";
            if (v.length > 128) return "Password is too long";
            if (!/[a-z]/.test(v)) return "Password must contain a lowercase letter";
            if (!/[A-Z]/.test(v)) return "Password must contain an uppercase letter";
            if (!/\d/.test(v)) return "Password must contain a number";
            if (!/[@$!%*?&#^()_+=\-[\]{}|\\:;"'<>,./]/.test(v)) return "Password must contain a special character";
            if (/(.)\1{2,}/.test(v)) return "Password cannot contain 3 or more repeated characters";
            return "";

        case "confirmPassword":
            // This will be handled separately with password comparison
            return "";

        case "age":
            if (!v) return "Age is required";
            const ageNum = parseInt(v);
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 65)
                return "Age must be between 18 and 65";
            return "";

        case "phone":
            if (!v) return "Phone number is required";
            if (!PHONE_REGEX.test(v)) return "Invalid phone format (e.g. +123 456-7890)";
            if (v.replace(/[^\d]/g, '').length < 7 || v.replace(/[^\d]/g, '').length > 15)
                return "Phone number must contain 7-15 digits";
            return "";

        case "department":
            if (!v) return "Department is required";
            return "";

        case "employeeCode":
            if (role === "EMPLOYEE") {
                if (!v) return "Employee code is required";
                if (!EMPLOYEE_CODE_REGEX.test(v.toUpperCase())) return "Format: EMP followed by 3-7 digits";
                // Async check for duplicate code
                if (asyncCheck && typeof asyncCheck === 'function') {
                    return asyncCheck(name, v);
                }
            }
            return "";

        case "adminCode":
            if (role === "ADMIN") {
                if (!v) return "Admin code is required";
                if (!ADMIN_CODE_REGEX.test(v.toUpperCase())) return "Format: ADMIN followed by 2-6 digits";
                // Async check for duplicate code
                if (asyncCheck && typeof asyncCheck === 'function') {
                    return asyncCheck(name, v);
                }
            }
            return "";

        case "reportingManager":
            if (role === "EMPLOYEE") {
                if (!v) return "Reporting manager is required";
                if (!REPORTING_MANAGER_REGEX.test(v)) return "Invalid manager name";
                if (v.length < 3 || v.length > 50) return "Name must be 3-50 characters";
            }
            return "";

        case "address.zipCode":
            if (!v) return "Zip code is required";
            if (!/^[0-9]{4,10}$/.test(v)) return "Invalid zip code (4-10 digits)";
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

        case "salary":
            if (!v) return "Salary is required";
            if (!SALARY_REGEX.test(v)) return "Salary must be a valid non-negative number";
            if (parseFloat(v) < 0) return "Salary cannot be negative";
            return "";

        case "joiningDate":
            if (!v) return "Joining date is required";
            return "";

        default:
            return "";
    }
};

/**
 * Validates the entire form
 * @param {Object} formData - Form state
 * @param {string} role - User role
 * @param {boolean} isEdit - Edit mode flag
 * @returns {Object} - Errors object
 */
export const validateForm = (formData, role = "EMPLOYEE", isEdit = false) => {
    const errors = {};

    // Fields to validate for creation/edit
    const fieldsToValidate = [
        "name",
        "email",
        "age",
        "phone",
        "department",
        "salary",
        "address.line1",
        "address.city",
        "address.state",
        "address.zipCode",
        role === "ADMIN" ? "adminCode" : "employeeCode",
        "joiningDate"
    ];

    if (role === "EMPLOYEE") fieldsToValidate.push("reportingManager");
    if (!isEdit) fieldsToValidate.push("password");

    fieldsToValidate.forEach(field => {
        let value;
        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            value = formData[parent]?.[child];
        } else {
            value = formData[field];
        }

        // Skip async checks during form validation (only do sync validation)
        const error = validateField(field, value, role, null);
        if (error) errors[field] = error;
    });

    // Validate password confirmation
    if (!isEdit) {
        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
    }

    return errors;
};
