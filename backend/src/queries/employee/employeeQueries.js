// region imports
// libraries
import mongoose from "mongoose";

// models
import Employee from "../../models/employee/employeeModel.js";
import User from "../../models/user/userModel.js";

// utils
import { getFormattedDateTime } from "../../utils/index.js";
// endregion

// region create employee
const createEmployee = async (payload = {}, adminId = null) => {
  try {
    // extract payload
    const {
      Name = "",
      Email = "",
      Password = "",
      Age,
      Department = "",
      Phone,
      Salary,
      Reporting_Manager,
      Address = {},
      Joining_Date,
      Employee_Code = "",
    } = payload || {};

    // normalize address
    const empAddress = {
      Line1: Address?.line1 || "",
      Line2: Address?.line2 || "",
      City: Address?.city || "",
      State: Address?.state || "",
      ZipCode: Address?.zipCode || "",
    };

    // create user
    const user = await new User({
      Name: Name || "",
      Email: Email || "",
      Password: Password || "",
      Role: "EMPLOYEE",
    })?.save?.();

    // create employee
    const employee = await new Employee({
      User_Id: user?.User_Id || null,
      Admin_Id: adminId || null,
      Age,
      Department,
      Phone,
      Salary,
      Reporting_Manager,
      Address: empAddress,
      Joining_Date,
      Employee_Code: Employee_Code || "",
    })?.save?.();

    return employee || null;
  } catch (err) {
    throw new Error("Error while creating employee: " + (err?.message || ""));
  }
};
// endregion

// region get all employees
const getAllEmployees = async (
  limit = 20,
  skip = 0,
  search = "",
  department = ""
) => {
  try {
    const safeLimit = Number(limit) || 20;
    const safeSkip = Number(skip) || 0;

    const matchStage = {
      Is_Deleted: 0,
      ...(department && { Department: department }),
    };

    const userSearchMatch = search
      ? {
          $or: [
            { "user.Name": { $regex: search, $options: "i" } },
            { "user.Email": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      { $match: { Is_Deleted: 0 } },

      {
        $lookup: {
          from: "users",
          localField: "User_Id",
          foreignField: "User_Id",
          pipeline: [{ $match: { Is_Deleted: 0, Role: "EMPLOYEE" } }],
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $facet: {
          // paginated + filtered data
          employees: [
            { $match: { ...matchStage, ...userSearchMatch } },
            { $sort: { Created_At: -1 } },
            { $skip: safeSkip },
            { $limit: safeLimit },
            {
              $project: {
                Employee_Id: 1,
                Name: "$user.Name",
                Email: "$user.Email",
                Age: 1,
                Department: 1,
                Phone: 1,
                Salary: 1,
                Reporting_Manager: 1,
                Address: 1,
                Joining_Date: 1,
                Employee_Code: 1,
                Created_At: 1,
              },
            },
          ],

          // filtered count
          filteredCount: [
            { $match: { ...matchStage, ...userSearchMatch } },
            { $count: "count" },
          ],

          // overall count (NO filters)
          overallCount: [
            { $match: { Is_Deleted: 0 } },
            { $count: "count" },
          ],
        },
      },
    ];

    const result = await Employee.aggregate(pipeline);

    return {
      employees: result?.[0]?.employees || [],
      filteredTotal: result?.[0]?.filteredCount?.[0]?.count || 0,
      overallTotal: result?.[0]?.overallCount?.[0]?.count || 0,
    };
  } catch (err) {
    throw new Error("Error while fetching employees: " + err.message);
  }
};
// endregion

// region get employee by id
const getEmployeeById = async (id = "") => {
  try {
    // validate id
    if (!id) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const result =
      (await Employee?.aggregate?.([
        { $match: { Employee_Id: objectId, Is_Deleted: 0 } },
        {
          $lookup: {
            from: "users",
            localField: "User_Id",
            foreignField: "User_Id",
            pipeline: [{ $project: { Name: 1, Email: 1 } }],
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            Employee_Id: 1,
            User_Id: 1,
            Admin_Id: 1,
            Name: "$user.Name",
            Email: "$user.Email",
            Age: 1,
            Department: 1,
            Phone: 1,
            Salary: 1,
            Reporting_Manager: 1,
            Address: 1,
            Joining_Date: 1,
            Employee_Code: 1,
            Created_At: 1,
            Updated_At: 1,
          },
        },
      ])) || [];

    return result?.[0] || null;
  } catch (err) {
    throw new Error(
      "Error while fetching employee by id: " + (err?.message || ""),
    );
  }
};
// endregion

// region update employee
const updateEmployee = async (employeeId = "", payload = {}) => {
  try {
    // validate id
    if (!employeeId) {
      return null;
    }

    const ALLOWED_FIELDS = [
      "name",
      "age",
      "department",
      "phone",
      "salary",
      "reportingManager",
      "address",
    ];

    Object.keys(payload || {}).forEach((key) => {
      if (!ALLOWED_FIELDS.includes(key)) {
        delete payload[key];
      }
    });

    const objectId = new mongoose.Types.ObjectId(employeeId);

    const existingEmployee = await Employee?.findOne?.({
      Employee_Id: objectId,
      Is_Deleted: 0,
    })?.lean?.();

    if (!existingEmployee) {
      return null;
    }

    const { name, age, department, phone, salary, reportingManager, address } =
      payload || {};

    // update user
    if (name !== undefined) {
      await User?.findOneAndUpdate?.(
        { User_Id: existingEmployee?.User_Id || null, Is_Deleted: 0 },
        { $set: { Name: name || "", Updated_At: getFormattedDateTime() } },
      );
    }

    const updateFields = {
      ...(age !== undefined && { Age: age }),
      ...(department !== undefined && { Department: department }),
      ...(phone !== undefined && { Phone: phone }),
      ...(salary !== undefined && { Salary: salary }),
      ...(reportingManager !== undefined && {
        Reporting_Manager: reportingManager,
      }),
      ...(address !== undefined && {
        Address: {
          Line1: address?.line1 || "",
          Line2: address?.line2 || "",
          City: address?.city || "",
          State: address?.state || "",
          ZipCode: address?.zipCode || "",
        },
      }),
      Updated_At: getFormattedDateTime(),
    };

    await Employee?.updateOne?.(
      { Employee_Id: objectId, Is_Deleted: 0 },
      { $set: updateFields },
    );

    return await getEmployeeById(employeeId);
  } catch (err) {
    throw new Error("Error while updating employee: " + (err?.message || ""));
  }
};
// endregion

// region delete employee
const deleteEmployee = async (employeeId = "") => {
  try {
    // validate id
    if (!employeeId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(employeeId);

    const employee = await Employee?.findOneAndUpdate?.(
      { Employee_Id: objectId, Is_Deleted: 0 },
      { $set: { Is_Deleted: 1 } },
      { new: true },
    )?.lean?.();

    if (!employee) {
      return null;
    }

    // delete linked user
    if (employee?.User_Id) {
      await User?.findOneAndUpdate?.(
        { User_Id: employee?.User_Id || null, Is_Deleted: 0 },
        { $set: { Is_Deleted: 1 } },
      );
    }

    return employee || null;
  } catch (err) {
    throw new Error("Error while deleting employee: " + (err?.message || ""));
  }
};
// endregion

// region check if employee code exists
const isEmployeeCodeExists = async (employeeCode = "") => {
  try {
    // validate code
    if (!employeeCode) {
      return false;
    }

    const emp = await Employee?.findOne?.({
      Employee_Code: employeeCode || "",
      Is_Deleted: 0,
    })?.lean?.();

    return !!emp;
  } catch (err) {
    throw new Error(
      "Error while checking employee code: " + (err?.message || ""),
    );
  }
};
// endregion

// region exports
export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmployeeCodeExists,
};
// endregion
