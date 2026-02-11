// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Admin from "../../models/admin/adminModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create admin
const createAdmin = async (payload = {}) => {
  // extract fields
  const { Name = "", Email = "", Password = "" } = payload;

  // create user
  const user = await new User({
    Name,
    Email,
    Password,
    Role: ROLE.ADMIN,
  }).save();

  // create admin
  const admin = new Admin({
    User_Id: user.User_Id,
  }).save();

  return admin;
};
// endregion

// region get all admins
const getAllAdmins = async (limit = 20, skip = 0, search = "") => {
  const pipeline = [
    { $match: { Is_Deleted: 0 } },

    // Join users
    {
      $lookup: {
        from: "users",
        localField: "User_Id",
        foreignField: "User_Id",
        pipeline: [
          {
            $match: {
              Role: ROLE.ADMIN,
              Is_Deleted: 0,
              ...(search && {
                $or: [
                  { Name: { $regex: search, $options: "i" } },
                  { Email: { $regex: search, $options: "i" } },
                ],
              }),
            },
          },
          { $project: { Name: 1, Email: 1 } },
        ],
        as: "user",
      },
    },

    // Remove admins whose user didn't match search
    { $unwind: "$user" },

    { $sort: { Created_At: -1 } },

    {
      $facet: {
        admins: [
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
  ];

  const result = await Admin.aggregate(pipeline);

  return {
    admins: result[0]?.admins || [],
    total: result[0]?.totalCount?.[0]?.count || 0,
  };
};
// endregion

// region get admin by id
const getAdminById = async (id = "") => {
  const result = await Admin.aggregate([
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
        pipeline: [
          { $match: { Is_Deleted: 0 } },
          { $project: { Name: 1, Email: 1 } },
        ],
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
        Created_At: 1,
        Updated_At: 1,
      },
    },
  ]);

  return result[0] || null;
};
// endregion

// region delete admin
const deleteAdmin = async (adminId = "") => {
  const updateSet = {
    Is_Deleted: 1,
    Updated_At: getFormattedDateTime(),
  };

  const doc = await Admin.findOneAndUpdate(
    { Admin_Id: adminId, Is_Deleted: 0 },
    { $set: updateSet },
    { new: true },
  ).lean();

  if (!doc) {
    return null;
  }

  if (doc.User_Id) {
    await User.findOneAndUpdate(
      { User_Id: doc.User_Id },
      {
        $set: {
          Is_Deleted: 1,
          Updated_At: getFormattedDateTime(),
        },
      },
    );
  }

  return doc;
};
// endregion

// region exports
export { createAdmin, getAllAdmins, getAdminById, deleteAdmin };
// endregion
