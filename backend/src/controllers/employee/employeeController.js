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
} from "../../queries/index.js";

import { validateObjectId } from "../../validations/helpers/typeValidations.js";
// endregion

// region list employees
const listEmployees = async (req = {}, res = {}) => {
  try {
    // filters and quries
    const limit = Math.min(100, Number(req?.query?.limit) || 5);
    const skip =
      req?.query?.skip !== undefined
        ? Math.max(0, Number(req?.query?.skip) || 0)
        : (Math.max(1, Number(req?.query?.page) || 1) - 1) * limit;
    const search = req?.query?.search || "";
    const department = req?.query?.department || "";

    // perform get all quereis
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

    // perform query for get an employee
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
    // validate fields
    const payload = req?.body || {};
    const validation = validateCreateEmployee(payload);
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    // destructure payload data
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
    } = payload;

    // map address obj
    const mappedAddress = {
      Line1: address?.line1 || "",
      Line2: address?.line2 || "",
      City: address?.city || "",
      State: address?.state || "",
      ZipCode: address?.zipCode || "",
    };

    // generate foreign fields
    const adminId = req?.user?.User_Id || null;
    // perform create employee , map the case
    const employee = await createEmployee(
      {
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
      },
      adminId,
    );

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Employee created successfully",
      employee,
    );
  } catch (err) {
    console.error("Error creating employee:", err);

    // check for unique
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      const isCode = field?.toLowerCase()?.includes("code");

      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        isCode ? "Employee Code already exists" : "Email already registered",
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

    // validate fields
    const payload = req?.body || {};
    const validation = validateUpdateEmployee(payload);
    if (!validation?.isValid) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        validation?.error,
      );
    }

    // desture payload data
    const {
      name,
      age,
      department,
      phone,
      address,
      salary,
      reportingManager,
      joiningDate,
      employeeCode,
    } = payload;

    // update the datas , only idf given in payload
    const updatePayload = {};
    if (name !== undefined) {
      updatePayload.Name = name?.trim() || "";
    }
    if (age !== undefined) {
      updatePayload.Age = age;
    }
    if (department !== undefined) {
      updatePayload.Department = department?.trim() || "";
    }
    if (phone !== undefined) {
      updatePayload.Phone = phone?.trim() || "";
    }
    if (salary !== undefined) {
      updatePayload.Salary = salary;
    }
    if (reportingManager !== undefined) {
      updatePayload.Reporting_Manager = reportingManager;
    }
    if (joiningDate !== undefined) {
      updatePayload.Joining_date = joiningDate;
    }
    if (employeeCode !== undefined) {
      updatePayload.Employee_Code = employeeCode;
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

    // perform update
    const updated = await updateEmployee({ _id: id }, updatePayload);
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

    // unique for employee code and email
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      const isCode = field?.toLowerCase()?.includes("code");

      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        isCode ? "Employee Code already exists" : "Email already registered",
      );
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

    // perform soft delete
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
