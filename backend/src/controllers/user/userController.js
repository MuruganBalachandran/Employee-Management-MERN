// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from "../../utils/index.js";

import { validateUpdateProfile } from "../../validations/index.js";
import {
  updateUserProfile,
  deleteUserAccount,
} from "../../queries/index.js";
import { getEmployeeById } from "../../queries/index.js";
// endregion

// region get profile
const getProfile = async (req = {}, res = {}) => {
  try {
    const user = req?.user;

    if (user?.Role === ROLE.EMPLOYEE) {
      const employee = await getEmployeeById(user?.User_Id);
      
      if (employee) {
        return sendResponse(
          res,
          STATUS_CODE?.OK || 200,
          RESPONSE_STATUS?.SUCCESS || "SUCCESS",
          "Profile fetched successfully",
          employee,
        );
      }
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile fetched successfully",
      {
        User_Id: user?.User_Id,
        Name: user?.Name,
        Email: user?.Email,
        Role: user?.Role,
      },
    );
  } catch (err) {
    console.error("Error fetching profile:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching profile",
    );
  }
};
// endregion

// region update profile
const updateProfile = async (req = {}, res = {}) => {
  try {
    const validation = validateUpdateProfile(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    const { name, password } = req?.body || {};

    const updateData = {};
    if (name !== undefined) updateData.Name = name?.trim() || "";
    if (password !== undefined) updateData.Password = password;

    const updatedUser = await updateUserProfile(req?.user, updateData);

    if (!updatedUser) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "No changes made",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile updated successfully",
      {
        User_Id: updatedUser?.User_Id,
        Name: updatedUser?.Name,
        Email: updatedUser?.Email,
        Role: updatedUser?.Role,
      },
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error updating profile",
    );
  }
};
// endregion

// region delete account
const deleteAccount = async (req = {}, res = {}) => {
  try {
    const result = await deleteUserAccount(req?.user);

    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Unable to delete account",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Account deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting account:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error deleting account",
    );
  }
};
// endregion

// region exports
export { getProfile, updateProfile, deleteAccount };
// endregion
