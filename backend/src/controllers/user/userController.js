// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from "../../utils/index.js";

import {
  validateUpdateEmployee,
} from "../../validations/index.js";
import {
  updateUserProfile,
  deleteUserAccount,
  updateEmployee,
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
    const user = req?.user || {};
    const isEmployee = user.Role === ROLE.EMPLOYEE;
    const payload = req?.body || {};

    // Validate using the unified employee validator (handles optional fields)
    const validation = validateUpdateEmployee(payload);
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    const {
      name,
      password,
      age,
      department,
      phone,
      address,
      personalEmail,
    } = payload;

    const updatePayload = {};

    // Common fields
    if (name !== undefined) {
      updatePayload.Name = name?.trim() || "";
    }
    if (password !== undefined) {
      updatePayload.Password = password;
    }

    // Employee specific fields
    if (isEmployee) {
      if (age !== undefined) {
        updatePayload.Age = age;
      }
      if (department !== undefined) {
        updatePayload.Department = department?.trim() || "";
      }
      if (phone !== undefined) {
        updatePayload.Phone = phone?.trim() || "";
      }

      if (address !== undefined && typeof address === "object") {
        updatePayload.Address = {
          Line1: address?.line1?.trim() || "",
          Line2: address?.line2?.trim() || "",
          City: address?.city?.trim() || "",
          State: address?.state?.trim() || "",
          ZipCode: address?.zipCode?.trim() || "",
        };
      }
    }

    let updatedResult;
    if (isEmployee) {
      updatedResult = await updateEmployee({ User_Id: user.User_Id }, updatePayload);
    } else {
      updatedResult = await updateUserProfile(user, updatePayload);
    }

    if (!updatedResult) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Profile not found or no changes made",
      );
    }

    // Return consistent data based on role
    const responseData = isEmployee
      ? await getEmployeeById(user.User_Id)
      : {
        User_Id: updatedResult?.User_Id,
        Name: updatedResult?.Name,
        Email: updatedResult?.Email,
        Role: updatedResult?.Role,
      };

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile updated successfully",
      responseData,
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
