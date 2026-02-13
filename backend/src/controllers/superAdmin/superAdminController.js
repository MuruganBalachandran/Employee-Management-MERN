// region imports
// utils
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

// validations
import {
  validateCreateAdmin,
  validateUpdateAdmin,
} from "../../validations/index.js";
import { validateObjectId } from "../../validations/helpers/typeValidations.js";

// queries
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
const listAdmins = async (req = {}, res = {}, next = () => {}) => {
  try {
    const query = req?.query ?? {};

    const limit = Math.min(100, Number(query?.limit ?? 5) || 5);
    const skip =
      query?.skip !== undefined
        ? Math.max(0, Number(query?.skip ?? 0) || 0)
        : (Math.max(1, Number(query?.page ?? 1) || 1) - 1) * limit;

    const search = query?.search ?? "";

    const result = await getAllAdmins(limit, skip, search);

    return sendResponse(
      res,
      STATUS_CODE.OK,
      RESPONSE_STATUS.SUCCESS,
      "Admins fetched successfully",
      {
        admins: result?.admins ?? [],
        filteredTotal: result?.filteredTotal ?? 0,
        overallTotal: result?.overallTotal ?? 0,
        skip,
        limit,
        currentPage: Math.floor(skip / limit) + 1,
        totalPages: Math.max(
          1,
          Math.ceil((result?.filteredTotal ?? 0) / limit)
        ),
      }
    );
  } catch (err) {
    console.error("Error listing admins:", err);
    next(err);
  }
};
// endregion


// region get admin details
const getAdmin = async (req = {}, res = {}, next = () => {}) => {
  try {
    // extract params
    const { id = "" } = req?.params ?? {};

    // validate id
    const idError = validateObjectId?.(id) ?? null;
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        idError,
      );
    }

    // fetch admin
    const admin = (await getAdminById?.(id)) ?? null;
    if (!admin) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND ?? 404,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin not found",
      );
    }

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Admin details fetched",
      admin,
    );
  } catch (err) {
    console.error("Error getting admin:", err);
    next?.(err);
  }
};
// endregion

// region create admin
const createNewAdmin = async (req = {}, res = {}, next = () => {}) => {
  try {
    // validate request body
    const validation = validateCreateAdmin?.(req?.body ?? {}) ?? {};
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        validation?.error ?? "Invalid input",
      );
    }

    // extract fields
    const {
      name = "",
      email = "",
      password = "",
      age = null,
      phone = null,
      salary = null,
      address = {},
      joiningDate = null,
      adminCode = "",
    } = req?.body ?? {};

    // check duplicate email
    if (await isEmailExists?.(email)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Email already exists",
      );
    }

    // check duplicate admin code
    if (await isAdminCodeExists?.(adminCode)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin code already exists",
      );
    }

    // normalize address
    const cleanAddress = {
      line1: address?.line1 ?? "",
      line2: address?.line2 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      zipCode: address?.zipCode ?? "",
    };

    // prepare payload
    const payload = {
      Name: name?.trim?.() ?? "",
      Email: email?.trim?.()?.toLowerCase?.() ?? "",
      Password: password ?? "",
      Age: age,
      Phone: phone,
      Salary: salary,
      Address: cleanAddress,
      Joining_Date: joiningDate,
      Admin_Code: adminCode ?? "",
    };

    // create admin
    const admin = await createAdmin?.(payload);

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Admin created successfully",
      admin,
    );
  } catch (err) {
    console.error("Error creating admin:", err);
    next?.(err);
  }
};
// endregion

// region update admin
const updateAdmin = async (req = {}, res = {}, next = () => {}) => {
  try {
    // extract params
    const { id = "" } = req?.params ?? {};

    // validate id
    const idError = validateObjectId?.(id) ?? null;
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        idError,
      );
    }

    // validate body
    const validation = validateUpdateAdmin?.(req?.body ?? {}) ?? {};
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        validation?.error ?? "Invalid input",
      );
    }

    // extract fields
    const { name, age, phone, salary, address, isActive } = req?.body ?? {};

    // prepare payload
    const payload = {
      ...(name !== undefined && { name: name?.trim?.() ?? "" }),
      ...(age !== undefined && { age }),
      ...(phone !== undefined && { phone }),
      ...(salary !== undefined && { salary }),
      ...(address !== undefined && { address }),
      ...(isActive !== undefined && { isActive }),
    };

    // prevent empty update
    if (!Object.keys(payload ?? {}).length) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "No valid fields provided for update",
      );
    }

    // update admin
    const result = await updateAdminDetails?.(id, payload);
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND ?? 404,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin not found",
      );
    }

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Admin updated successfully",
      result,
    );
  } catch (err) {
    console.error("Error updating admin:", err);
    next?.(err);
  }
};
// endregion

// region delete admin
const removeAdmin = async (req = {}, res = {}, next = () => {}) => {
  try {
    // extract params
    const { id = "" } = req?.params ?? {};

    // validate id
    const idError = validateObjectId?.(id) ?? null;
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        idError,
      );
    }

    // delete admin
    const result = (await deleteAdmin?.(id)) ?? null;
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND ?? 404,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin not found",
      );
    }

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Admin deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting admin:", err);
    next?.(err);
  }
};
// endregion

// region change permission
const changePermission = async (req = {}, res = {}, next = () => {}) => {
  try {
    // extract params
    const { id = "" } = req?.params ?? {};

    // validate id
    const idError = validateObjectId?.(id) ?? null;
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        idError,
      );
    }

    // extract permission
    const { permission = "" } = req?.body ?? {};
    if (!["GRANTED", "REVOKED"].includes(permission)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Invalid permission value",
      );
    }

    // update permission
    const result = (await updateAdminPermission?.(id, permission)) ?? null;
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND ?? 404,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin not found",
      );
    }

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Permission updated successfully",
      result,
    );
  } catch (err) {
    console.error("Error updating permission:", err);
    next?.(err);
  }
};
// endregion

// region check email availability
const checkEmail = async (req = {}, res = {}, next = () => {}) => {
  try {
    // extract body
    const { email = "" } = req?.body ?? {};

    if (!email) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Email is required",
      );
    }

    // check email
    if (await isEmailExists?.(email)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Email already exists",
      );
    }

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Email is available",
    );
  } catch (err) {
    console.error("Error checking email:", err);
    next?.(err);
  }
};
// endregion

// region check admin code availability
const checkAdminCode = async (req = {}, res = {}, next = () => {}) => {
  try {
    // extract body
    const { adminCode = "" } = req?.body ?? {};

    if (!adminCode) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin code is required",
      );
    }

    // check admin code
    if (await isAdminCodeExists?.(adminCode)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST ?? 400,
        RESPONSE_STATUS?.FAILURE ?? "FAILURE",
        "Admin code already exists",
      );
    }

    // send response
    return sendResponse(
      res,
      STATUS_CODE?.OK ?? 200,
      RESPONSE_STATUS?.SUCCESS ?? "SUCCESS",
      "Admin code is available",
    );
  } catch (err) {
    console.error("Error checking admin code:", err);
    next?.(err);
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
