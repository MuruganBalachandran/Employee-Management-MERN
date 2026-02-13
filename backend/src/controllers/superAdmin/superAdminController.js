// region imports
//  utils
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

//  validations
import {
  validateCreateAdmin,
  validateUpdateAdmin,
} from "../../validations/index.js";
import { validateObjectId } from "../../validations/helpers/typeValidations.js";

//  queries
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  updateAdminDetails,
  updateAdminPermission,
  isEmailExists,
  isAdminCodeExists,
} from "../../queries/index.js";
// endregion

// region list admins
const listAdmins = async (req = {}, res = {}, next) => {
  try {
    //query params
    const limit = Math.min(100, Number(req?.query?.limit) || 5);
    const skip =
      req?.query?.skip !== undefined
        ? Math.max(0, Number(req?.query?.skip) || 0)
        : (Math.max(1, Number(req?.query?.page) || 1) - 1) * limit;

    const search = req?.query?.search || "";

    //fetch admins
    const result = (await getAllAdmins(limit, skip, search)) || {};

    //send response
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
    next(err);
  }
};
// endregion

// region get admin details
const getAdmin = async (req = {}, res = {}, next) => {
  try {
    const { id = "" } = req?.params || {};

    //validate id
    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }

    //fetch admin
    const admin = (await getAdminById(id)) || null;
    if (!admin) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin details fetched",
      admin,
    );
  } catch (err) {
    console.error("Error getting admin:", err);
    next(err);
  }
};
// endregion

// region create admin
const createNewAdmin = async (req = {}, res = {}, next) => {
  try {
    const validation = validateCreateAdmin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    const {
      name = "",
      email = "",
      password = "",
      age = "",
      phone = "",
      salary = "",
      address = {},
      joiningDate = "",
      adminCode = "",
    } = req?.body || {};

    if (await isEmailExists(email)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Email already exists",
      );
    }

    if (await isAdminCodeExists(adminCode)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin code already exists",
      );
    }

    const cleanAddress = {
      line1: address?.line1 || "",
      line2: address?.line2 || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode || "",
    };

    // 🔑 Permissions will default to GRANTED at DB level
    const admin = await createAdmin({
      Name: name?.trim() || "",
      Email: email?.trim()?.toLowerCase() || "",
      Password: password || "",
      Age: age,
      Phone: phone,
      Salary: salary,
      Address: cleanAddress,
      Joining_Date: joiningDate,
      Admin_Code: adminCode || "",
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
    next(err);
  }
};
// endregion
// region update admin
const updateAdmin = async (req = {}, res = {}, next) => {
  try {
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

    const validation = validateUpdateAdmin(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    const {
      name,
      age,
      phone,
      salary,
      address,
      isActive,
    } = req?.body || {};

    // 🔑 explicit editable fields ONLY
    const payload = {
      ...(name !== undefined && { name }),
      ...(age !== undefined && { age }),
      ...(phone !== undefined && { phone }),
      ...(salary !== undefined && { salary }),
      ...(address !== undefined && { address }),
      ...(isActive !== undefined && { isActive }),
    };

    const result = await updateAdminDetails(id, payload);

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
      "Admin updated successfully",
      result,
    );
  } catch (err) {
    console.error("Error updating admin:", err);
    next(err);
  }
};
// endregion



// region delete admin
const removeAdmin = async (req = {}, res = {}, next) => {
  try {
    const { id = "" } = req?.params || {};

    //validate id
    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }

    //delete admin
    const result = (await deleteAdmin(id)) || null;
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting admin:", err);
    next(err);
  }
};
// endregion



// region change permission
const changePermission = async (req = {}, res = {}, next) => {
  try {
    const { id = "" } = req?.params || {};

    //validate id
    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }

    //validate permission
    const { permission = "" } = req?.body || {};
    if (!["GRANTED", "REVOKED"].includes(permission)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Invalid permission value",
      );
    }

    //update permission
    const result = (await updateAdminPermission(id, permission)) || null;

    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Permission updated successfully",
      result,
    );
  } catch (err) {
    console.error("Error updating permission:", err);
    next(err);
  }
};
// endregion

// region check email availability
const checkEmail = async (req = {}, res = {}, next) => {
  try {
    const { email = "" } = req?.body || {};

    if (!email) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Email is required",
      );
    }

    // Check if email exists
    if (await isEmailExists(email)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Email already exists",
      );
    }

    // Email is available
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Email is available",
    );
  } catch (err) {
    console.error("Error checking email:", err);
    next(err);
  }
};
// endregion

// region check admin code availability
const checkAdminCode = async (req = {}, res = {}, next) => {
  try {
    const { adminCode = "" } = req?.body || {};

    if (!adminCode) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin code is required",
      );
    }

    // Check if admin code exists
    if (await isAdminCodeExists(adminCode)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Admin code already exists",
      );
    }

    // Admin code is available
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin code is available",
    );
  } catch (err) {
    console.error("Error checking admin code:", err);
    next(err);
  }
};
// endregion

// region exports
export {
  listAdmins,
  getAdmin,
  createNewAdmin,
  removeAdmin,
  updateAdmin,
  changePermission,
  checkEmail,
  checkAdminCode,
};
// endregion
