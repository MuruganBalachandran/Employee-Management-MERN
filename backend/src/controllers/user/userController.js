// region imports
// package imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

// validation imports
import { validateUpdateProfile } from "../../validations/index.js";

// query imports
import { updateUserProfile, deleteUserAccount } from "../../queries/index.js";
// endregion

// region get profile controller
const getProfile = async (req = {}, res = {}) => {
  try {
    // return current authenticated user
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile fetched successfully",
      { user: req?.user },
    );
  } catch (err) {
    console.error("Error getting profile:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching profile",
    );
  }
};
// endregion

// region update profile controller
const updateProfile = async (req = {}, res = {}) => {
  try {
    // validate update input
    const validation = validateUpdateProfile(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        validation?.statusCode || STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    // Extract fields in camelCase from API payload with defaults
    const { name, password, age, department, phone, address } = req.body || {};

    // Map address from camelCase (API) to PascalCase (DB)
    const mappedAddress =
      address && typeof address === "object"
        ? {
            Line1: address?.line1 || address?.Line1 || "",
            Line2: address?.line2 || address?.Line2 || "",
            City: address?.city || address?.City || "",
            State: address?.state || address?.State || "",
            ZipCode: address?.zipCode || address?.ZipCode || "",
          }
        : address;

    // Map to PascalCase for database update
    const updatedUser = await updateUserProfile(req?.user, {
      Name: name,
      Password: password,
      Age: age,
      Department: department,
      Phone: phone,
      Address: mappedAddress,
    });

    if (!updatedUser) {
      return sendResponse(
        res,
        STATUS_CODE?.OK || 200,
        RESPONSE_STATUS?.SUCCESS || "SUCCESS",
        "No changes detected",
      );
    }

    // send success response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Profile updated successfully",
      updatedUser,
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

// region delete user controller
const deleteAccount = async (req = {}, res = {}) => {
  try {
    const targetUser = req?.user;
    const deletedUser = await deleteUserAccount(targetUser);

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Account deleted successfully",
      deletedUser,
    );
  } catch (err) {
    console.error("Error deleting account:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || 500,
      "Error deleting account",
    );
  }
};
// endregion

// region exports
export { getProfile, updateProfile, deleteAccount };
// endregion
