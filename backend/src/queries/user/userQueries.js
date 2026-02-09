// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region update user profile
const updateUserProfile = async (user = {}, updateData = {}) => {
  const allowedFields = ["Name", "Password"];
  const updateSet = {
      Updated_At: getFormattedDateTime()
  };
  
  let isChanged = false;
  
  for (const field of allowedFields) {
      if (updateData[field] !== undefined && updateData[field] !== user[field]) {
           updateSet[field] = updateData[field];
           isChanged = true;
      }
  }
  
  if (!isChanged) return null;
  
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
  if (typeof target === "object" && target.User_Id) {
      userId = target.User_Id;
  }
  
  const user = await User.findOneAndUpdate(
      { User_Id: userId, Role: { $ne: ROLE.SUPER_ADMIN }, Is_Deleted: 0 },
      { 
          $set: { 
              Is_Deleted: 1, 
              Updated_At: getFormattedDateTime() 
          } 
      },
      { new: true }
  );
  
  return user;
};
// endregion

// region admin management
const findSuperAdmin = async () => {
  const admins = await User.aggregate([
    {
      $match: {
        Role: ROLE.SUPER_ADMIN,
        Is_Deleted: 0,
      },
    },
    {
      $project: {
        _id: 1,
        User_Id: 1,
        Name: 1,
        Email: 1,
        Role: 1,
        Is_Deleted: 1,
        Created_At: 1,
        Updated_At: 1,
      },
    },
    { $limit: 1 },
  ]);

  return admins.length > 0 ? admins[0] : null;
};

const findUserById = async (id = "") => {
  const users = await User.aggregate([
    {
      $match: {
        User_Id: new mongoose.Types.ObjectId(id),
        Is_Deleted: 0,
      },
    },
    {
      $project: {
        _id: 1,
        User_Id: 1,
        Name: 1,
        Email: 1,
        Role: 1,
        Is_Deleted: 1,
        Created_At: 1,
        Updated_At: 1,
      },
    },
    { $limit: 1 },
  ]);

  return users.length > 0 ? users[0] : null;
};

const createInitialSuperAdmin = async (email = "", password = "") => {
  const superAdmin = new User({
    Name: "Super Admin",
    Email: email,
    Password: password,
    Role: ROLE.SUPER_ADMIN,
  });
  await superAdmin.save();
  return superAdmin;
};
// endregion

// region exports
export {
  updateUserProfile,
  deleteUserAccount,
  findSuperAdmin,
  findUserById,
  createInitialSuperAdmin,
};
// endregion
