// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import Admin from "../../models/admin/adminModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create admin
const createAdmin = async (payload = {}) => {
  const {
    Name = "",
    Email = "",
    Password = "",
  } = payload;

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
const getAllAdmins = async (limit = 20, skip = 0, search = "") => {
  const matchStage = { Is_Deleted: 0 };

  if (search) {
    // Search in User collection first for Name/Email
    const users = await User.find({
      $or: [
        { Name: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ],
      Role: ROLE.ADMIN,
      Is_Deleted: 0,
    })
      .select("User_Id")
      .limit(1000)
      .lean();

    matchStage.User_Id = { $in: users.map((u) => u.User_Id) };
  }

  const result = await Admin.aggregate([
    { $match: matchStage },
    { $sort: { Created_At: -1 } },
    {
      $facet: {
        admins: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "User_Id",
              foreignField: "User_Id",
              pipeline: [{ $project: { Name: 1, Email: 1 } }],
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
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  return {
    admins: result[0]?.admins || [],
    total: result[0]?.totalCount?.[0]?.count || 0,
  };
};
// endregion

// region get admin by id
const getAdminById = async (id = "") => {
  const doc = await Admin.findOne({
    Admin_Id: new mongoose.Types.ObjectId(id),
    Is_Deleted: 0,
  }).lean();

  if (!doc) {
    return null;
  }

  const user = await User.findOne({
    User_Id: doc.User_Id,
    Is_Deleted: 0,
  })
    .select("Name Email")
    .lean();

  if (!user) {
    return null;
  }

  return {
    ...doc,
    Name: user.Name,
    Email: user.Email,
  };
};
// endregion

// region update admin
const updateAdmin = async (adminId = "", payload = {}) => {
  if (!payload.Name) {
    return Admin.findOne({ Admin_Id: adminId, Is_Deleted: 0 });
  }

  // Single query to get admin with User_Id
  const adminDoc = await Admin.findOne({ Admin_Id: adminId, Is_Deleted: 0 });
  if (!adminDoc) return null;

  // Update user name (we already have the User_Id, no extra query needed)
  await User.findOneAndUpdate({ User_Id: adminDoc.User_Id }, {
    Name: payload.Name,
    Updated_At: getFormattedDateTime()
  });

  return adminDoc;
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

export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
