// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

import { validateCreateAdmin } from "../../validations/index.js";
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
} from "../../queries/index.js";

import { validateObjectId } from "../../validations/helpers/typeValidations.js";
// endregion

// region list admins
const listAdmins = async (req = {}, res = {}) => {
  try {
    // quereis and filters
    const limit = Math.min(100, Number(req?.query?.limit) || 5);
    const skip = req?.query?.skip !== undefined
      ? Math.max(0, Number(req?.query?.skip) || 0)
      : (Math.max(1, Number(req?.query?.page) || 1) - 1) * limit;

    const search = req?.query?.search || "";

    // perform get all admins
    const result = await getAllAdmins(limit, skip, search);

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admins fetched successfully",
      {
        admins: result?.admins || [],
        total: result?.total || 0,
        skip,
        limit,
        currentPage: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil((result?.total || 0) / limit),
      },
    );
  } catch (err) {
    console.error("Error listing admins:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching admins",
    );
  }
};
// endregion

// region get admin details
const getAdmin = async (req = {}, res = {}) => {
  try {

    // validate id
    const { id = "" } = req?.params || {};
    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }

    // perform get admin by id
    const admin = await getAdminById(id);
    if (!admin) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin not found",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin details fetched",
      admin,
    );
  } catch (err) {
    console.error("Error getting admin:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching admin",
    );
  }
};
// endregion

// region create admin
const createNewAdmin = async (req = {}, res = {}) => {
  try {
    // validate fields
    const validation = validateCreateAdmin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    // destrue payload data
    const {
      name = "",
      email = "",
      password = "",
    } = req?.body || {};

    // perform create admin
    const admin = await createAdmin({
      Name: name?.trim() || "",
      Email: email?.trim()?.toLowerCase() || "",
      Password: password,
    });

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin created successfully",
      admin,
    );
  } catch (err) {
    console.error("Error creating admin:", err);

    if (err?.code === 11000) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Email already registered",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error creating admin",
    );
  }
};
// endregion

// region delete admin
const removeAdmin = async (req = {}, res = {}) => {
  try {
    // validate id
    const { id = "" } = req?.params || {};
    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }
    // perform deklete admin
    const result = await deleteAdmin(id);
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin not found",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting admin:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error deleting admin",
    );
  }
};
// endregion

// region exports
export {
  listAdmins,
  getAdmin,
  createNewAdmin,
  removeAdmin,
};
// endregion
