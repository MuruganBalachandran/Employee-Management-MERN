// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create employee
const createEmployee = async (userData = {}) => {
  try {
    const {
      Name = "",
      Email = "",
      Password = "",
      Age = 0,
      Department = "",
      Phone = "",
      Address = {},
      User_Id = null,
    } = userData || {};

    // Create User document (if not already created)
    let userId = User_Id;
    if (!userId) {
      const user = new User({
        Name: Name.trim() || "",
        Email: Email.trim().toLowerCase() || "",
        Password: Password,
        Age: Age || 0,
        Role: ROLE.EMPLOYEE,
        Department: Department.trim() || "",
        Phone: Phone.trim() || "",
        Address: Address || {},
      });
      await user.save();
      userId = user._id;
    }

    // Create Employee document
    const employee = new Employee({
      User_Id: userId,
      Name: Name.trim() || "",
      Email: Email.trim().toLowerCase() || "",
      Password: Password,
      Age: Age || 0,
      Department: Department.trim() || "",
      Phone: Phone.trim() || "",
      Address: Address || {},
    });

    await employee.save();
    return employee;
  } catch (err) {
    console.error("Error creating employee:", err);
    throw err;
  }
};
// endregion

// region get all employees
const getAllEmployees = async (
  limit = 20,
  skip = 0,
  search = "",
  department = "",
) => {
  try {
    const matchStage = { Is_Deleted: 0 };

    if (search) {
      matchStage.$or = [
        { Name: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      matchStage.Department = department;
    }

    // Use $facet to get both employees and total count in single query
    const result = await Employee.aggregate([
      { $match: matchStage },
      // Join with users to check Role
      {
        $lookup: {
          from: "users", // collection name
          localField: "User_Id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Filter strictly for EMPLOYEE role
      { $match: { "user.Role": ROLE.EMPLOYEE } },
      {
        $facet: {
          employees: [
            { $sort: { Created_At: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                User_Id: 1,
                Name: 1,
                Email: 1,
                Age: 1,
                Department: 1,
                Phone: 1,
                Address: 1,
                Created_At: 1,
                Updated_At: 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const employees = result[0]?.employees || [];
    const total = result[0]?.totalCount?.[0]?.count || 0;

    return { employees, total };
  } catch (err) {
    console.error("Error fetching employees:", err);
    throw err;
  }
};
// endregion

// region get employee by id
const getEmployeeById = async (id = "") => {
  try {
    const employees = await Employee.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          Is_Deleted: 0,
        },
      },
      {
        $project: {
          _id: 1,
          User_Id: 1,
          Name: 1,
          Email: 1,
          Password: 1,
          Age: 1,
          Department: 1,
          Phone: 1,
          Address: 1,
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
    ]);

    return employees.length > 0 ? employees[0] : null;
  } catch (err) {
    console.error("Error finding employee by ID:", err);
    throw err;
  }
};
// endregion

// region update employee
const updateEmployee = async (employee = {}, updateData = {}) => {
  try {
    let doc = employee;
    if (typeof employee.save !== "function") {
      doc = await Employee.findById(employee._id);
    }

    if (!doc) return null;

    const allowedFields = ["Name", "Age", "Department", "Phone", "Address"];
    let isChanged = false;

    for (const field of allowedFields) {
      if (updateData[field] !== undefined && updateData[field] !== doc[field]) {
        doc[field] =
          field === "Name" ? updateData[field].trim() : updateData[field];
        isChanged = true;
      }
    }

    if (!isChanged) {
      return null;
    }

    doc.Updated_At = getFormattedDateTime();
    await doc.save();
    return doc;
  } catch (err) {
    console.error("Error updating employee:", err);
    throw err;
  }
};
// endregion

// region delete employee
const deleteEmployee = async (employee = {}) => {
  try {
    if (!employee) {
      return null;
    }

    let doc = employee;
    if (typeof employee.save !== "function") {
      doc = await Employee.findById(employee._id);
    }

    if (!doc) {
      return null;
    }

    doc.Is_Deleted = 1;
    doc.Updated_At = getFormattedDateTime() || new Date().toISOString();

    await doc.save();
    return doc;
  } catch (err) {
    console.error("Error deleting employee:", err);
    throw err;
  }
};
// endregion

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
