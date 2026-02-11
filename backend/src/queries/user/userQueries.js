// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Employee from "../../models/employee/employeeModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

const updateUserProfile = async (user = {}, payload = {}) => {
  if (payload.Name === undefined || payload.Name === user.Name) {
    return null;
  }

  return User.findOneAndUpdate(
    { User_Id: user.User_Id, Is_Deleted: 0 },
    {
      $set: {
        Name: payload.Name.trim(),
        Updated_At: getFormattedDateTime(),
      },
    },
    { new: true },
  );
};

// region delete user account
const deleteUserAccount = async (target = {}) => {
  // user and role
  let userId = target;
  let role = null;

  if (typeof target === "object" && target.User_Id) {
    userId = target.User_Id;
    role = target.Role;
  }

  // update based on the role
  const [user] = await Promise.all([
    User.findOneAndUpdate(
      { User_Id: userId, Role: { $ne: ROLE.SUPER_ADMIN }, Is_Deleted: 0 },
      {
        $set: {
          Is_Deleted: 1,
          Updated_At: getFormattedDateTime(),
        },
      },
      { new: true },
    ),
    role === ROLE.EMPLOYEE
      ? Employee.findOneAndUpdate(
          { User_Id: userId, Is_Deleted: 0 },
          {
            $set: {
              Is_Deleted: 1,
              Updated_At: getFormattedDateTime(),
            },
          },
          { new: true },
        )
      : Promise.resolve(null),
  ]);

  return user;
};
// endregion

// region find user
const findUserById = async (id = "") => {
  return await User.findOne({
    User_Id: new mongoose.Types.ObjectId(id),
    Is_Deleted: 0,
  }).lean();
};

// region exports
export { updateUserProfile, deleteUserAccount, findUserById };
// endregion
