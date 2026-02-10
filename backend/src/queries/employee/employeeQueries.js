// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create employee
const createEmployee = async (userData = {}, adminId = null) => {
    const {
      Name = "",
      Email = "",
      Password = "",
      Age = 0,
      Department = "",
      Phone = "",
      Address = {},
      Salary = 0,
      Reporting_Manager = null,
      Joining_date = null,
    } = userData || {};

    // Create User document
    const user = new User({
        Name: Name.trim() || "",
        Email: Email.trim().toLowerCase() || "",
        Password: Password,
        Role: ROLE.EMPLOYEE,
    });
    await user.save();
    
    // Create Employee document
    const employee = new Employee({
      User_Id: user.User_Id,
      Admin_Id: adminId, // Record who created this employee
      Age: Age || 0,
      Department: Department.trim() || "",
      Phone: Phone.trim() || "",
      Address: Address || {},
      Salary: Salary || 0,
      Reporting_Manager: Reporting_Manager, 
      Joining_date: Joining_date || new Date(),
      Is_Active: 1
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
    // Search by Name or Email in User collection first
    const users = await User.find({
      $or: [
        { Name: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ],
      Role: ROLE.EMPLOYEE,
      Is_Deleted: 0,
    }).select("User_Id");

    matchStage.User_Id = { $in: users.map((u) => u.User_Id) };
  }

  if (department) {
    matchStage.Department = department;
  }

  // Optimized aggregation: sort and limit before expensive lookups
  const result = await Employee.aggregate([
    { $match: matchStage },
    { $sort: { Created_At: -1 } }, // Sort early on indexed field
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
                { $match: { Role: ROLE.EMPLOYEE } }, // Filter in lookup
                { $project: { Name: 1, Email: 1 } } // Only needed fields
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
              pipeline: [
                { $project: { Name: 1 } } // Only manager name needed
              ],
              as: "manager"
            }
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
              ManagerName: "$manager.Name"
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
const updateEmployee = async (filter = {}, updateData = {}) => {
  const { Name, ...employeeData } = updateData;
  
  const employeeAllowedFields = [
      "Age", "Department", "Phone", "Address", "Personal_Email",
      "Salary", "Reporting_Manager", "Joining_date", "Employee_Code"
  ];

  const employeeUpdateSet = {
      Updated_At: getFormattedDateTime()
  };
  
  let hasEmployeeUpdates = false;

  Object.keys(employeeData).forEach(key => {
      if (employeeAllowedFields.includes(key)) {
           employeeUpdateSet[key] = employeeData[key];
           hasEmployeeUpdates = true;
      }
       if (key === 'Address' && typeof employeeData[key] === 'object') {
           employeeUpdateSet.Address = employeeData[key];
           hasEmployeeUpdates = true;
       }
  });

  // Use Employee_Id for filtering
  const query = { ...filter, Is_Deleted: 0 };
  if (query._id) {
    query.Employee_Id = query._id;
    delete query._id;
  }
  
  // Optimization: If no updates, just check existence (1 DB hit)
  if (!hasEmployeeUpdates && !Name) {
      return await Employee.findOne(query);
  }

  // Single atomic update for employee (1 DB hit)
  const doc = await Employee.findOneAndUpdate(
      query,
      { $set: employeeUpdateSet },
      { new: true }
  );
  
  if (!doc) return null;

  // If Name update needed, do it in parallel (doesn't increase wait time)
  // But we await to ensure consistency before returning
  if (Name && doc.User_Id) {
      await User.findOneAndUpdate({ User_Id: doc.User_Id }, {
          Name,
          Updated_At: getFormattedDateTime()
      });
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
