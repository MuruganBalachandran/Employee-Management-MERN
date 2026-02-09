// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Admin from "../../models/admin/adminModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create admin
const createAdmin = async (adminData = {}) => {
  const {
    Name = "",
    Email = "",
    Password = "",
  } = adminData;

  const user = new User({
      Name,
      Email,
      Password,
      Role: ROLE.ADMIN,
  });
  await user.save();
  
  const admin = new Admin({
    User_Id: user.User_Id,
  });

  await admin.save();
  return admin;
};
// endregion

// region get all admins
const getAllAdmins = async (
  limit = 20,
  skip = 0,
  search = ""
) => {
  const matchStage = { Is_Deleted: 0 };

  if (search) {
      matchStage.$or = [
          { Name: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
      ];
  }

  const result = await Admin.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "User_Id",
        foreignField: "User_Id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: { "user.Role": ROLE.ADMIN } },
    {
      $facet: {
        admins: [
          { $sort: { Created_At: -1 } },
          { $skip: skip },
          { $limit: limit },
           {
            $project: {
              _id: 1,
              Admin_Id: 1,
              User_Id: 1,
              Name: "$user.Name",
              Email: "$user.Email",
              Created_At: 1,
              Updated_At: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const admins = result[0]?.admins || [];
  const total = result[0]?.totalCount?.[0]?.count || 0;

  return { admins, total };
};
// endregion

// region get admin by id
const getAdminById = async (id = "") => {
  const admins = await Admin.aggregate([
    {
      $match: {
          Admin_Id: new mongoose.Types.ObjectId(id),
        Is_Deleted: 0,
      },
    },
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
        Admin_Id: 1,
        User_Id: 1,
        Name: "$user.Name",
        Email: "$user.Email",
        Is_Deleted: 1,
        Created_At: 1,
        Updated_At: 1,
      },
    },
  ]);

  return admins.length > 0 ? admins[0] : null;
};
// endregion

// region update admin
const updateAdmin = async (adminId = "", updateData = {}) => {
  if (!updateData.Name) {
      return Admin.findOne({ Admin_Id: adminId, Is_Deleted: 0 });
  }
  
  // Single query to get admin with User_Id
  const adminDoc = await Admin.findOne({ Admin_Id: adminId, Is_Deleted: 0 });
  if (!adminDoc) return null;
  
  // Update user name (we already have the User_Id, no extra query needed)
  await User.findOneAndUpdate({ User_Id: adminDoc.User_Id }, {
      Name: updateData.Name,
      Updated_At: getFormattedDateTime()
  });
  
  return adminDoc;
};
// endregion

// region delete admin
const deleteAdmin = async (adminId = "") => {
  const updateSet = {
      Is_Deleted: 1,
      Updated_At: getFormattedDateTime()
  };
  
  // Single update to get admin doc with User_Id
  const doc = await Admin.findOneAndUpdate(
      { Admin_Id: adminId },
      { $set: updateSet },
      { new: true }
  );

  if (!doc) return null;

  // Parallel update of User (doesn't wait for Admin update to complete)
  if (doc.User_Id) {
      await User.findOneAndUpdate({ User_Id: doc.User_Id }, {
          Is_Deleted: 1,
          Updated_At: getFormattedDateTime()
      });
  }

  return doc;
};
// endregion

export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
