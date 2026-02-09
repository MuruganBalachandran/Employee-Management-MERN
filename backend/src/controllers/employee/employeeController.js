// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";

import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from "../../validations/index.js";

import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmployeeCodeTaken,
} from "../../queries/index.js";

import { validateObjectId } from "../../validations/helpers/typeValidations.js";
// endregion

// region list employees
const listEmployees = async (req = {}, res = {}) => {
  try {
    const limit = Math.min(100, Number(req?.query?.limit) || 5);
    const skip = req?.query?.skip !== undefined 
      ? Math.max(0, Number(req?.query?.skip) || 0)
      : (Math.max(1, Number(req?.query?.page) || 1) - 1) * limit;
    
    const search = req?.query?.search || "";
    const department = req?.query?.department || "";

    const result = await getAllEmployees(limit, skip, search, department);

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
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching employees",
    );
  }
};
// endregion

// region get employee details
const getEmployee = async (req = {}, res = {}) => {
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

    const employee = await getEmployeeById(id);

    if (!employee) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee not found",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee details fetched",
      employee,
    );
  } catch (err) {
    console.error("Error getting employee:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error fetching employee",
    );
  }
};
// endregion

// region create employee
const createNewEmployee = async (req = {}, res = {}) => {
  try {
    const validation = validateCreateEmployee(req?.body || {});
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    const {
      name = "",
      email = "",
      password = "",
      employeeCode = "",
      age = 0,
      department = "",
      phone = "",
      address = {},
      salary = 0,
      reportingManager = null,
      joiningDate = null,
    } = req?.body || {};

    const codeExists = await isEmployeeCodeTaken(employeeCode);
    if (codeExists) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS.FAILURE,
        "Employee Code already exists",
      );
    }

    // Map address from camelCase to PascalCase
    const mappedAddress = address && typeof address === "object"
      ? {
          Line1: address?.line1 || "",
          Line2: address?.line2 || "",
          City: address?.city || "",
          State: address?.state || "",
          ZipCode: address?.zipCode || "",
        }
      : {};

    const adminId = req?.user?.User_Id || req?.user?._id || null;

    const employee = await createEmployee({
      Name: name?.trim() || "",
      Email: email?.trim()?.toLowerCase() || "",
      Password: password,
      Employee_Code: employeeCode,
      Age: age,
      Department: department?.trim() || "",
      Phone: phone?.trim() || "",
      Address: mappedAddress,
      Salary: salary,
      Reporting_Manager: reportingManager,
      Joining_date: joiningDate,
    }, adminId);

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee created successfully",
      employee,
    );
  } catch (err) {
    console.error("Error creating employee:", err);
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0];
      if (key === "Employee_Code" || key === "employeeCode") {
        return sendResponse(
          res,
          STATUS_CODE?.BAD_REQUEST || 400,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Employee Code already exists"
        );
      }
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
      err?.message || "Error creating employee",
    );
  }
};
// endregion

// region update employee
const updateEmployeeDetails = async (req = {}, res = {}) => {
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
    // NOTE: Removed previous pre-fetch of getEmployeeById(id) to save 1 DB hit.
    // We proceed directly to update. If not found, updateEmployee returns null.

    const validation = validateUpdateEmployee(req?.body || {});
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
      age, 
      department, 
      phone, 
      address, 
      personalEmail,
      salary, 
      reportingManager, 
      joiningDate, 
      employeeCode
    } = req?.body || {};
    const updateData = {};
    if (name !== undefined) updateData.Name = name?.trim() || "";
    if (age !== undefined) updateData.Age = age;
    if (department !== undefined) updateData.Department = department?.trim() || "";
    if (phone !== undefined) updateData.Phone = phone?.trim() || "";
    if (personalEmail !== undefined) updateData.Personal_Email = personalEmail?.trim() || "";
    if (salary !== undefined) updateData.Salary = salary;
    if (reportingManager !== undefined)
      updateData.Reporting_Manager = reportingManager;
    if (joiningDate !== undefined) updateData.Joining_date = joiningDate;
    if (employeeCode !== undefined) updateData.Employee_Code = employeeCode;

    if (address !== undefined && typeof address === "object") {
      updateData.Address = {
        Line1: address?.line1?.trim() || "",
        Line2: address?.line2?.trim() || "",
        City: address?.city?.trim() || "",
        State: address?.state?.trim() || "",
        ZipCode: address?.zipCode?.trim() || "",
      };
    }

    // Admin update logic (isSelfUpdate = false by default in query)
    const updated = await updateEmployee({ _id: id }, updateData);

    if (!updated) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee not found or no changes made",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee updated successfully",
      updated,
    );
  } catch (err) {
    console.error("Error updating employee:", err);
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0];
      if (key === "Employee_Code") return sendResponse(res, STATUS_CODE?.BAD_REQUEST || 400, RESPONSE_STATUS?.FAILURE || "FAILURE", "Employee Code already exists");
      return sendResponse(res, STATUS_CODE?.BAD_REQUEST || 400, RESPONSE_STATUS?.FAILURE || "FAILURE", "Duplicate entry");
    }
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error updating employee",
    );
  }
};
// endregion

// region delete employee
const removeEmployee = async (req = {}, res = {}) => {
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
    // Removed pre-fetch to save DB hit.

    const result = await deleteEmployee(id);

    if (!result) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Employee not found",
      );
    }

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting employee:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error deleting employee",
    );
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
};
// endregion
