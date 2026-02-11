// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create employee
const createEmployee = async (payload = {}, adminId = null) => {
  try {
  
  // destureture payload data
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

  // Create User
  const user = await new User({
    Name: Name.trim() || "",
    Email: Email.trim().toLowerCase() || "",
    Password: Password,
    Role: ROLE.EMPLOYEE,
  }).save();

  // Create Employee
  const employee = await new Employee({
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
  }).save();

  return employee;
    } catch (err) {
    throw new Error("Error creating employee:",err);
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
    

  const pipeline = [
    { $match: { Is_Deleted: 0 } },
    {
      $lookup: {
        from: "users",
        localField: "User_Id",
        foreignField: "User_Id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    // Search filter
    ...(search
      ? [{
          $match: {
            // search by name or email
            $or: [
              { "user.Name": { $regex: search, $options: "i" } },
              { "user.Email": { $regex: search, $options: "i" } },
            ],
          },
        }]
      : []),

    // Department filter
    ...(department ? [{ $match: { Department: department } }] : []),

    { $sort: { Created_At: -1 } },

    {
      $facet: {
        employees: [
          { $skip: skip },
          { $limit: limit },

          // Manager lookup
          {
            $lookup: {
              from: "employees",
              localField: "Reporting_Manager",
              foreignField: "Employee_Id",
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
  ];

  const result = await Employee.aggregate(pipeline);

  return {
    employees: result[0]?.employees || [],
    total: result[0]?.totalCount?.[0]?.count || 0,
  };
    } catch (err) {
    throw new Error("Error while getAll employees " , err);
  }
  
};

// endregion

// region get employee by id
const getEmployeeById = async (id = "") => {
  try {
    

  const employees = await Employee.aggregate([
    {
      $match: {
        $or: [
          { Employee_Id: new mongoose.Types.ObjectId(id) },
          { User_Id: new mongoose.Types.ObjectId(id) },
        ],
        Is_Deleted: 0,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "Reporting_Manager",
        foreignField: "Employee_Id",
        as: "manager",
      },
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
    } catch (err) {
    throw new Error("Error get employee by id", err);
  }
};
// endregion

// region update quereis
const updateEmployee = async (filter = {}, payload = {}) => {
  try {
    

  const {
    Name,
    Age,
    Department,
    Phone,
    Address,
    Salary,
    Reporting_Manager,
    Joining_date,
    Employee_Code,
  } = payload;

  const employeeUpdateSet = {};

  if (Age !== undefined) {
    employeeUpdateSet.Age = Number(Age);
  }
  if (Department !== undefined) {
    employeeUpdateSet.Department = Department.trim();
  }
  if (Phone !== undefined) {
    employeeUpdateSet.Phone = Phone.trim();
  }
  if (Salary !== undefined) {
    employeeUpdateSet.Salary = Number(Salary);
  }
  if (Reporting_Manager !== undefined) {
    employeeUpdateSet.Reporting_Manager = Reporting_Manager;
  }
  if (Joining_date !== undefined) {
    employeeUpdateSet.Joining_date = Joining_date;
  }
  if (Employee_Code !== undefined) {
    employeeUpdateSet.Employee_Code = Employee_Code.trim();
  }
  if (Address !== undefined && typeof Address === "object") {
    employeeUpdateSet.Address = Address;
  }

  const query = { ...filter, Is_Deleted: 0 };
  if (query._id) {
    query.Employee_Id = query._id;
    delete query._id;
  }

  // Update Employee
  const doc = await Employee.findOneAndUpdate(
    query,
    { $set: employeeUpdateSet },
    { new: true },
  ).lean();
  if (!doc) return null;

  // Update User Name
  if (Name !== undefined && doc.User_Id) {
    await User.findOneAndUpdate(
      { User_Id: doc.User_Id },
      { Name: Name.trim() },
    );
  }

  return doc;
    } catch (err) {
    throw new Error("Error while perform update employee",err);
  }
};
// endregion

// region delete employee
const deleteEmployee = async (employeeId = "") => {
  try {
    

  const updateSet = {
    Is_Deleted: 1,
    Updated_At: getFormattedDateTime(),
  };

  const doc = await Employee.findOneAndUpdate(
    { Employee_Id: employeeId },
    { $set: updateSet },
    { new: true },
  );

  if (!doc) return null;

  if (doc.User_Id) {
    await User.findOneAndUpdate(
      { User_Id: doc.User_Id },
      {
        Is_Deleted: 1,
        Updated_At: getFormattedDateTime(),
      },
    );
  }

  return doc;
    } catch (err) {
    console.log("Error while perform delete employee",err)
  }
};
// endregion

// region check employee code uniqueness
const isEmployeeCodeTaken = async (code, excludeId = null) => {
  try {
    

  const query = { Employee_Code: code };

  // while editing, ignore same employee
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Employee.findOne(query).lean();
  return !!existing;
    } catch (err) {
    throw new Error("Error while perform check code token")
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
  isEmployeeCodeTaken,
};
// endregion
