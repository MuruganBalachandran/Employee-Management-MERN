// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

import { validateLogin } from "../../validations/index.js";
import { findUserByEmail } from "../../queries/index.js";
import { verifyPassword, generateToken } from "../../utils/index.js";
// endregion

// region login
const login = async (req = {}, res = {}) => {
  try {
    const validation = validateLogin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    const { email = "", password = "" } = req?.body || {};

    const user = await findUserByEmail(email?.trim()?.toLowerCase() || "");

    const isPasswordValid = user && await verifyPassword(password, user?.Password || "");

    if (!user || !isPasswordValid) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Invalid credentials",
      );
    }

    const token = generateToken({
      User_Id: user?.User_Id,
      email: user?.Email,
      role: user?.Role,
    });

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Login successful",
      {
        token,
        user: {
          User_Id: user?.User_Id,
          Name: user?.Name,
          Email: user?.Email,
          Role: user?.Role,
        },
      },
    );
  } catch (err) {
    console.error("Error during login:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error during login",
    );
  }
};
// endregion

// region logout
const logout = async (req = {}, res = {}) => {
  try {
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Logout successful",
    );
  } catch (err) {
    console.error("Error during logout:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error during logout",
    );
  }
};
// endregion

// region exports
export { login, logout };
// endregion
