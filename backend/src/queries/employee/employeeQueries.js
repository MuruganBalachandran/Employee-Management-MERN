// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create employee
const createEmployee = async (payload = {}, adminId = null) => {
  const {
    Name = "",
    Email = "",
    Password = "",
    Age = 0,
    Employee_Code = "",
    Department = "",
    Phone = "",
    Address = {},
    Salary = 0,
    Reporting_Manager = null,
    Joining_date = null,
  } = payload;

  // 1. Create User
  const user = new User({
    Name: Name.trim() || "",
    Email: Email.trim().toLowerCase() || "",
    Password: Password,
    Role: ROLE.EMPLOYEE,
  });
  await user.save();

  // 2. Create Employee
  const employee = new Employee({
    User_Id: user.User_Id,
    Admin_Id: adminId,
    Age: Age || 0,
    Employee_Code: Employee_Code,
    Department: Department.trim() || "",
    Phone: Phone.trim() || "",
    Address: Address || {},
    Salary: Salary || 0,
    Reporting_Manager: Reporting_Manager,
    Joining_date: Joining_date || new Date(),
    Is_Active: 1,
  });

  await employee.save();
  return employee;
};
// endregion

// region get all employees
const getAllEmployees = async (
  limit = 20,
  skip = 0,
  search = "",
  department = "",
) => {
  const matchStage = { Is_Deleted: 0 };

  if (search) {
    // Limit search retrieval to top 1000 matching IDs to prevent massive $in arrays
    const users = await User.find({
      $or: [
        { Name: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ],
      Role: ROLE.EMPLOYEE,
      Is_Deleted: 0,
    })
      .select("User_Id")
      .limit(1000)
      .lean();

    matchStage.User_Id = { $in: users.map((u) => u.User_Id) };
  }

  if (department) {
    matchStage.Department = department;
  }

  // Optimized aggregation: facet for pagination + localized lookups
  const result = await Employee.aggregate([
    { $match: matchStage },
    { $sort: { Created_At: -1 } },
    {
      $facet: {
        employees: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "User_Id",
              foreignField: "User_Id",
              pipeline: [
                { $project: { Name: 1, Email: 1 } },
              ],
              as: "user",
            },
          },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
          {
            $lookup: {
              from: "employees",
              localField: "Reporting_Manager",
              foreignField: "Employee_Id",
              pipeline: [{ $project: { Name: 1 } }],
              as: "manager",
            },
          },
          { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              Employee_Id: 1,
              User_Id: 1,
              Admin_Id: 1,
              Name: "$user.Name",
              Email: "$user.Email",
              Employee_Code: 1,
              Age: 1,
              Department: 1,
              Phone: 1,
              Address: 1,
              Salary: 1,
              Joining_date: 1,
              Is_Active: 1,
              Reporting_Manager: 1,
              Created_At: 1,
              Updated_At: 1,
              ManagerName: "$manager.Name",
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  return {
    employees: result[0]?.employees || [],
    total: result[0]?.totalCount?.[0]?.count || 0,
  };
};
// endregion

// region get employee by id
const getEmployeeById = async (id = "") => {
  const employees = await Employee.aggregate([
    {
      $match: {
        $or: [
          { Employee_Id: new mongoose.Types.ObjectId(id) },
          { User_Id: new mongoose.Types.ObjectId(id) }
        ],
        Is_Deleted: 0,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "Reporting_Manager",
        foreignField: "Employee_Id",
        as: "manager"
      }
    },
    { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "User_Id",
        foreignField: "User_Id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        Employee_Id: 1,
        User_Id: 1,
        Admin_Id: 1,
        Name: "$user.Name",
        Email: "$user.Email",
        Employee_Code: 1,
        Age: 1,
        Department: 1,
        Phone: 1,
        Address: 1,
        Salary: 1,
        Joining_date: 1,
        Is_Active: 1,
        Reporting_Manager: 1,
        ManagerName: "$manager.Name",
        Is_Deleted: 1,
        Created_At: 1,
        Updated_At: 1,
      },
    },
  ]);

  return employees.length > 0 ? employees[0] : null;
};
// endregion

// region update employee
const updateEmployee = async (filter = {}, payload = {}) => {
  const { Name, Password, ...employeePayload } = payload;

  const employeeAllowedFields = [
    "Age",
    "Department",
    "Phone",
    "Address",
    "Salary",
    "Reporting_Manager",
    "Joining_date",
    "Employee_Code",
  ];

  const employeeUpdateSet = {
    Updated_At: getFormattedDateTime(),
  };

  let hasEmployeeUpdates = false;

  Object.keys(employeePayload).forEach((key) => {
    if (employeeAllowedFields.includes(key)) {
      employeeUpdateSet[key] = employeePayload[key];
      hasEmployeeUpdates = true;
    }
  });

  const query = { ...filter, Is_Deleted: 0 };

  // Use Employee_Id specifically if _id is passed
  if (query._id) {
    query.Employee_Id = query._id;
    delete query._id;
  }

  // 1. Update Employee
  const doc = await Employee.findOneAndUpdate(
    query,
    { $set: employeeUpdateSet },
    { new: true },
  ).lean();

  if (!doc) {
    return null;
  }

  // 2. Update User in parallel if Name or Password is provided
  const userUpdatePayload = {};
  if (Name !== undefined) {
    userUpdatePayload.Name = Name;
  }
  if (Password !== undefined) {
    userUpdatePayload.Password = Password;
  }

  if (Object.keys(userUpdatePayload).length > 0 && doc.User_Id) {
    await User.findOneAndUpdate(
      { User_Id: doc.User_Id },
      {
        ...userUpdatePayload,
        Updated_At: getFormattedDateTime(),
      },
    );
  }

  return doc;
};
// endregion

// region delete employee
const deleteEmployee = async (employeeId = "") => {
  const updateSet = {
    Is_Deleted: 1,
    Updated_At: getFormattedDateTime()
  }

  const doc = await Employee.findOneAndUpdate(
    { Employee_Id: employeeId },
    { $set: updateSet },
    { new: true }
  );

  if (!doc) return null;

  if (doc.User_Id) {
    await User.findOneAndUpdate({ User_Id: doc.User_Id }, {
      Is_Deleted: 1,
      Updated_At: getFormattedDateTime()
    });
  }

  return doc;
};
// endregion

// region check employee code uniqueness
const isEmployeeCodeTaken = async (code, excludeId = null) => {
  const query = { Employee_Code: code };

  // while editing, ignore same employee
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Employee.findOne(query).lean();
  return !!existing;
};
// endregion

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  isEmployeeCodeTaken,
};
