// region imports
//  utils
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";
import { verifyPassword, generateToken } from "../../utils/index.js";

//  validations
import { validateLogin } from "../../validations/index.js";

//  model
import { findUserByEmail, getProfileQuery } from "../../queries/index.js";
import { Admin } from "../../models/index.js";
// endregion

// region login controller
const login = async (req = {}, res = {}, next) => {
  try {
    //validate request body
    const validation = validateLogin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    //extract credentials
    const { email = "", password = "" } = req?.body || {};
    const normalizedEmail = email?.trim()?.toLowerCase() || "";

    //find user
    const user = (await findUserByEmail(normalizedEmail)) || null;
    const isPasswordValid =
      user && (await verifyPassword(password || "", user?.Password || ""));

    if (!user || !isPasswordValid) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Invalid credentials",
      );
    }

    //determine permissions
    let permission = "GRANTED";

    if (user?.Role === "ADMIN") {
      const admin = await Admin.findOne(
        { User_Id: user?.User_Id || "", Is_Deleted: 0 },
        { Permissions: 1 },
      )?.lean?.();

      permission = admin?.Permissions || "REVOKED";

      if (permission === "REVOKED") {
        return sendResponse(
          res,
          STATUS_CODE?.FORBIDDEN || 403,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Admin access revoked",
        );
      }
    }

    //generate token
    const token = generateToken({
      User_Id: user?.User_Id || "",
      email: user?.Email || "",
      role: user?.Role || "USER",
      permission,
    });

    //set cookie
    res?.cookie?.("token", token, {
      httpOnly: true,
      secure: process?.env?.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Login successful",
      {
        user: {
          User_Id: user?.User_Id || "",
          Name: user?.Name || "",
          Email: user?.Email || "",
          Role: user?.Role || "USER",
        },
      },
    );
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
  }
};
// endregion

// region logout controller
const logout = async (req = {}, res = {}, next) => {
  try {
    //clear cookie
    res?.clearCookie?.("token", {
      httpOnly: true,
      secure: process?.env?.NODE_ENV === "production",
      sameSite: "Strict",
    });

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Logout successful",
    );
  } catch (err) {
    console.error("Error during logout:", err);
    next(err);
  }
};
// endregion

// region get profile controller
const getProfile = async (req = {}, res = {}, next) => {
  try {
    const userId = req?.user?.User_Id || "";
    if (!userId) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Unauthorized",
      );
    }

    //fetch profile
    const user = (await getProfileQuery(userId)) || null;
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "User not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile fetched successfully",
      user,
    );
  } catch (err) {
    console.error("Error fetching profile:", err);
    next(err);
  }
};
// endregion

// region exports
export { login, logout, getProfile };
// endregion
