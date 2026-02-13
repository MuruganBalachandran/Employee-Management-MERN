// region imports
//  utils
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

//  queries
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmployeeCodeExists,
  isEmailExists,
} from "../../queries/index.js";

//  validations
import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from "../../validations/index.js";
import { validateObjectId } from "../../validations/helpers/typeValidations.js";
// endregion

// region list employees
const listEmployees = async (req = {}, res = {}, next) => {
  try {
    //query params
    const limit = Math.min(100, Number(req?.query?.limit) || 5);
    const skip =
      req?.query?.skip !== undefined
        ? Math.max(0, Number(req?.query?.skip) || 0)
        : (Math.max(1, Number(req?.query?.page) || 1) - 1) * limit;

    const search = req?.query?.search || "";
    const department = req?.query?.department || "";

    //fetch employees
    const result =
      (await getAllEmployees(limit, skip, search, department)) || {};

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employees fetched successfully",
      {
        employees: result?.employees || [],
        total: result?.total || 0,
        skip,
        limit,
        currentPage: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil((result?.total || 0) / limit),
      },
    );
  } catch (err) {
    console.error("Error listing employees:", err);
    next(err);
  }
};
// endregion

// region get employee details
const getEmployee = async (req = {}, res = {}, next) => {
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

    //fetch employee
    const employee = (await getEmployeeById(id)) || null;
    if (!employee) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee details fetched",
      employee,
    );
  } catch (err) {
    console.error("Error getting employee:", err);
    next(err);
  }
};
// endregion

// region create employee
const createNewEmployee = async (req = {}, res = {}, next) => {
  try {
    //validate request body
    const validation = validateCreateEmployee(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error || "Invalid input",
      );
    }

    //extract fields
    const {
      name = "",
      email = "",
      password = "",
      age,
      department,
      phone,
      salary,
      reportingManager,
      address = {},
      joiningDate,
      employeeCode = "",
    } = req?.body || {};

    //check duplicate email
    if (await isEmailExists(email)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Email already exists",
      );
    }

    //check duplicate employee code
    if (await isEmployeeCodeExists(employeeCode)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee code already exists",
      );
    }

    //normalize address
    const cleanAddress = {
      line1: address?.line1 || "",
      line2: address?.line2 || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode || "",
    };

    //prepare payload
    const payload = {
      Name: name?.trim() || "",
      Email: email?.trim()?.toLowerCase() || "",
      Password: password || "",
      Age: age,
      Department: department,
      Phone: phone,
      Salary: salary,
      Reporting_Manager: reportingManager,
      Address: cleanAddress,
      Joining_date: joiningDate,
      Employee_Code: employeeCode || "",
      Admin_Id: req?.user?.Admin_Id || null,
    };

    //create employee
    const employee = await createEmployee(payload);

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee created successfully",
      employee,
    );
  } catch (err) {
    console.error("Error creating employee:", err);
    next(err);
  }
};
// endregion

// region update employee
const updateEmployeeDetails = async (req = {}, res = {}, next) => {
  try {
    const { id = "" } = req?.params || {};

    // validate id
    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(res, 400, "FAILURE", idError);
    }

    // validate body
    const validation = validateUpdateEmployee(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(res, 400, "FAILURE", validation?.error);
    }

    const {
      name,
      age,
      department,
      phone,
      salary,
      reportingManager,
      address,
    } = req.body || {};

    // normalize address (same as create)
    const cleanAddress =
      address !== undefined
        ? {
            line1: address?.line1 || "",
            line2: address?.line2 || "",
            city: address?.city || "",
            state: address?.state || "",
            zipCode: address?.zipCode || "",
          }
        : undefined;

    // prepare payload (same pattern as create)
    const payload = {
      ...(name !== undefined && { name: name.trim() }),
      ...(age !== undefined && { age }),
      ...(department !== undefined && { department }),
      ...(phone !== undefined && { phone }),
      ...(salary !== undefined && { salary }),
      ...(reportingManager !== undefined && { reportingManager }),
      ...(cleanAddress !== undefined && { address: cleanAddress }),
    };

    // prevent empty update
    if (!Object.keys(payload).length) {
      return sendResponse(
        res,
        400,
        "FAILURE",
        "No valid fields provided for update"
      );
    }

    const result = await updateEmployee(id, payload);
    if (!result) {
      return sendResponse(res, 404, "FAILURE", "Employee not found");
    }

    return sendResponse(
      res,
      200,
      "SUCCESS",
      "Employee updated successfully",
      result
    );
  } catch (err) {
    console.error("Error updating employee:", err);
    next(err);
  }
};

// endregion

// region delete employee
const removeEmployee = async (req = {}, res = {}, next) => {
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

    //delete employee
    const result = (await deleteEmployee(id)) || null;
    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting employee:", err);
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

// region check employee code availability
const checkEmployeeCode = async (req = {}, res = {}, next) => {
  try {
    const { employeeCode = "" } = req?.body || {};

    if (!employeeCode) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee code is required",
      );
    }

    // Check if employee code exists
    if (await isEmployeeCodeExists(employeeCode)) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee code already exists",
      );
    }

    // Employee code is available
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee code is available",
    );
  } catch (err) {
    console.error("Error checking employee code:", err);
    next(err);
  }
};
// endregion

// region exports
export {
  listEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployeeDetails,
  removeEmployee,
  checkEmail,
  checkEmployeeCode,
};
// endregion
