// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region update user profile
const updateUserProfile = async (user = {}, payload = {}) => {
  const allowedFields = ["Name", "Password"];
  const updateSet = {
    Updated_At: getFormattedDateTime()
  };

  let isChanged = false;

  for (const field of allowedFields) {
    if (payload[field] !== undefined && payload[field] !== user[field]) {
      updateSet[field] = payload[field];
      isChanged = true;
    }
  }

  if (!isChanged) {
    return null;
  }

  const updatedUser = await User.findOneAndUpdate(
    { User_Id: user.User_Id, Is_Deleted: 0 },
    { $set: updateSet },
    { new: true }
  );

  return updatedUser;
};
// endregion

// region delete user account
const deleteUserAccount = async (target = {}) => {
  let userId = target;
  let role = null;

  if (typeof target === "object" && target.User_Id) {
    userId = target.User_Id;
    role = target.Role;
  }

  // Use parallel updates for consistency and performance
  const [user] = await Promise.all([
    User.findOneAndUpdate(
      { User_Id: userId, Role: { $ne: ROLE.SUPER_ADMIN }, Is_Deleted: 0 },
      {
        $set: {
          Is_Deleted: 1,
          Updated_At: getFormattedDateTime()
        }
      },
      { new: true }
    ),
    role === ROLE.EMPLOYEE ? Employee.findOneAndUpdate(
      { User_Id: userId, Is_Deleted: 0 },
      {
        $set: {
          Is_Deleted: 1,
          Updated_At: getFormattedDateTime()
        }
      },
      { new: true }
    ) : Promise.resolve(null)
  ]);

  return user;
};
// endregion

// region find user
const findUserById = async (id = "") => {
  return await User.findOne({
    User_Id: new mongoose.Types.ObjectId(id),
    Is_Deleted: 0,
  })
    .lean();
};

// region exports
export {
  updateUserProfile,
  deleteUserAccount,
  findUserById,
};
// endregion
