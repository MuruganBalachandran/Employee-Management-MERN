// region model imports
import User from "../../models/user/userModel.js";
import Admin from "../../models/admin/adminModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { ROLE } from "../../utils/constants/constants.js";
// endregion

// region create admin by super admin
const createUser = async (userData = {}) => {
  try {
    const {
      Name = "",
      Email = "",
      Password = "",
      Age = 0,
      Department = "",
      Phone = "",
      Address = {},
    } = userData || {};

    // Role is FIXED — cannot be overridden
    const finalRole = ROLE.ADMIN;

    // Create user (triggers password hash hook)
    const user = await new User({
      Name: (Name || "").trim(),
      Email: (Email || "").trim().toLowerCase(),
      Password: Password || "",
      Age: Age || 0,
      Role: finalRole,
      Department: (Department || "").trim(),
      Phone: (Phone || "").trim(),
      Address: Address || {},
    }).save();

    // Create Admin profile
    await new Admin({
      Admin_Id: user._id,
      Name: user.Name,
      Email: user.Email,
      Password: user.Password,
      Age: user.Age,
      Department: user.Department,
      Phone: user.Phone,
      Address: user.Address,
    }).save();

    return user;
  } catch (err) {
    console.error("Error creating admin:", err);
    throw err;
  }
};
// endregion

// region find user by email
const findUserByEmail = async (email = "") => {
  try {
    // Find active user by email using aggregation pipeline
    // Mongoose model call, no ?.
    const users = await User.aggregate([
      {
        $match: {
          Email: (email || "").trim().toLowerCase(),
          Is_Deleted: 0,
        },
      },
      {
        $project: {
          _id: 1,
          Name: 1,
          Email: 1,
          Password: 1,
          Age: 1,
          Role: 1,
          Department: 1,
          Phone: 1,
          Address: 1,
          Is_Deleted: 1,
          Created_At: 1,
          Updated_At: 1,
        },
      },
    ]);

    // Return first user or null if not found
    return users?.length > 0 ? users[0] : null;
  } catch (err) {
    console.error("Error finding user by email:", err);
    throw err;
  }
};
// endregion

// region exports
export { createUser, findUserByEmail };
// endregion
