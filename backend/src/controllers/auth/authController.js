// region imports
// package imports
import {
  verifyPassword,
  generateToken,
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from "../../utils/index.js";

// validation imports
import {
  validateSignup,
  validateLogin,
  validateEmailDomain,
} from "../../validations/index.js";

// query imports
import { createUser, findUserByEmail } from "../../queries/index.js";
// endregion

// region signup controller
const signup = async (req = {}, res = {}) => {
  try {
    // validate input against rules
    const validation = validateSignup(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode || STATUS_CODE?.BAD_REQUEST,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    // extract fields with camelCase from req.body with defaults
    const {
      name = "",
      email = "",
      password = "",
      age = 0,
    } = req.body || {};

   const role="ADMIN";

      const department = "Administration";
      const phone = "000-000-0000";
        const address = {
          Line1: "Admin HQ",
          City: "Admin City",
          State: "AD",
          ZipCode: "00000",
        };
      

    // Domain Validation based on Role
    const domainError = validateEmailDomain({ email, role });
    if (domainError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST,
        RESPONSE_STATUS?.FAILURE,
        domainError,
      );
    }

    // check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Email already registered",
      );
    }

    // create user in DB (Model hook will handle hashing automatically)
    const user = await createUser({
      Name: name,
      Email: email,
      Password: password,
      Age: age,
      Role: role,
      Department: department,
      Phone: phone,
      Address: address,
    });

    // generate JWT token for immediate login
    const token = generateToken(user?._id.toString());

    // send success response
    const successMessage =
      role === ROLE.EMPLOYEE
        ? "User registered successfully"
        : "Admin created successfully";
    return sendResponse(
      res,
      STATUS_CODE?.CREATED || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      successMessage,
      {
        user,
        token,
      },
    );
  } catch (err) {
    console.error("Error in signup:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error processing request",
    );
  }
};
// endregion

// region login controller
const login = async (req = {}, res = {}) => {
  try {
    // validate login input
    const validation = validateLogin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode || STATUS_CODE?.BAD_REQUEST,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    const { email = "", password = "" } = req.body || {};

    // fetch user by email
    const user = await findUserByEmail(email);

    // verify password
    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await verifyPassword(password, user?.Password || "");
    }

    // send response for invalid credentials
    if (!user || !isPasswordValid) {
      console.log(
        `[Login Failed] Email: ${email}, UserFound: ${!!user}, PasswordValid: ${!!isPasswordValid}`,
      );
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Invalid credentials",
      );
    }

    // generate JWT token (stateless)
    const token = generateToken(user?._id.toString());

    // send success response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Login successful",
      {
        user,
        token,
      },
    );
  } catch (err) {
    console.error("Error in login:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error processing request",
    );
  }
};
// endregion

// region logout controller
const logout = async (req = {}, res = {}) => {
  try {
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Logged out successfully",
    );
  } catch (err) {
    console.error("Error in logout:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error processing request",
    );
  }
};
// endregion

// region exports
export { signup, login, logout };
// endregion
