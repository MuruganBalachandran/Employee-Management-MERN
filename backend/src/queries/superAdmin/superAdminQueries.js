// region imports
import mongoose from "mongoose";
import { User, Admin } from "../../models/index.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create admin
const createAdmin = async (payload = {}) => {
  try {
    //extract payload
    const {
      Name = "",
      Email = "",
      Password = "",
      Age,
      Department,
      Phone,
      Salary,
      Address = {},
      Joining_Date,
      Admin_Code = "",
    } = payload || {};

    //create user
    const user = await new User({
      Name: Name || "",
      Email: Email || "",
      Password: Password || "",
      Role: ROLE?.ADMIN || "ADMIN",
    }).save();

    //normalize address
    const adminAddress = {
      Line1: Address?.line1 || "",
      Line2: Address?.line2 || "",
      City: Address?.city || "",
      State: Address?.state || "",
      ZipCode: Address?.zipCode || "",
    };

    //create admin profile
    const admin = await new Admin({
      User_Id: user?.User_Id || null,
      Age,
      Department,
      Phone,
      Salary,
      Address: adminAddress,
      Joining_Date,
      Admin_Code: Admin_Code || "",
    }).save();

    return admin || null;
  } catch (err) {
    throw new Error(
      "Error while performing create admin: " + (err?.message || ""),
    );
  }
};
// endregion

// region get all admins
const getAllAdmins = async (limit = 20, skip = 0, search = "") => {
  try {
    //build pipeline
    const pipeline = [
      { $match: { Is_Deleted: 0 } },

      //join users
      {
        $lookup: {
          from: "users",
          localField: "User_Id",
          foreignField: "User_Id",
          pipeline: [
            {
              $match: {
                Role: ROLE?.ADMIN || "ADMIN",
                Is_Deleted: 0,
                ...(search
                  ? {
                    $or: [
                      { Name: { $regex: search, $options: "i" } },
                      { Email: { $regex: search, $options: "i" } },
                    ],
                  }
                  : {}),
              },
            },
          ],
          as: "user",
        },
      },

      { $unwind: "$user" },
      { $sort: { Created_At: -1 } },

      //paginate and project
      {
        $facet: {
          admins: [
            { $skip: skip || 0 },
            { $limit: limit || 20 },
            {
              $project: {
                Admin_Id: 1,
                User_Id: 1,
                Age: 1,
                Department: 1,
                Phone: 1,
                Salary: 1,
                Address: 1,
                Joining_date: 1,
                Admin_Code: 1,
                Permissions: 1,
                Is_Active: 1,
                Created_At: 1,
                Updated_At: 1,
                Name: "$user.Name",
                Email: "$user.Email",
                Role: "$user.Role",
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = (await Admin.aggregate(pipeline)) || [];

    //return response
    return {
      admins: result?.[0]?.admins || [],
      total: result?.[0]?.totalCount?.[0]?.count || 0,
    };
  } catch (err) {
    throw new Error(
      "Error while performing get all admins: " + (err?.message || ""),
    );
  }
};
// endregion

// region get admin by id
const getAdminById = async (id = "") => {
  try {
    //validate id
    if (!id) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const result =
      (await Admin.aggregate([
        { $match: { Admin_Id: objectId, Is_Deleted: 0 } },

        //join user
        {
          $lookup: {
            from: "users",
            localField: "User_Id",
            foreignField: "User_Id",
            pipeline: [{ $match: { Is_Deleted: 0 } }],
            as: "user",
          },
        },

        { $unwind: "$user" },

        //project fields
        {
          $project: {
            Admin_Id: 1,
            User_Id: 1,
            Age: 1,
            Department: 1,
            Phone: 1,
            Salary: 1,
            Address: 1,
            Joining_date: 1,
            Admin_Code: 1,
            Permissions: 1,
            Is_Active: 1,
            Created_At: 1,
            Updated_At: 1,
            Name: "$user.Name",
            Email: "$user.Email",
            Role: "$user.Role",
          },
        },
      ])) || [];

    return result?.[0] || null;
  } catch (err) {
    throw new Error(
      "Error while performing get admin by id: " + (err?.message || ""),
    );
  }
};
// endregion

// region delete admin
const deleteAdmin = async (adminId = "") => {
  try {
    //validate id
    if (!adminId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(adminId);

    //soft delete admin
    const doc = await Admin.findOneAndUpdate(
      { Admin_Id: objectId, Is_Deleted: 0 },
      { $set: { Is_Deleted: 1 } },
      { new: true },
    ).lean();

    if (!doc) {
      return null;
    }

    //soft delete user
    if (doc?.User_Id) {
      await User.findOneAndUpdate(
        { User_Id: doc?.User_Id || null, Is_Deleted: 0 },
        { $set: { Is_Deleted: 1 } },
      );
    }

    return doc;
  } catch (err) {
    throw new Error(
      "Error while performing delete admin: " + (err?.message || ""),
    );
  }
};
// endregion

// region update admin details
const updateAdminDetails = async (adminId = "", payload = {}) => {
  try {
    //validate id
    if (!adminId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(adminId);

    const existingAdmin = await Admin.findOne({
      Admin_Id: objectId,
      Is_Deleted: 0,
    }).lean();

    if (!existingAdmin) {
      return null;
    }

    //extract fields
    const { name, age, department, phone, salary, address, isActive, permissions } =
      payload || {};

    //update user name
    if (name !== undefined) {
      await User.findOneAndUpdate(
        { User_Id: existingAdmin?.User_Id || null, Is_Deleted: 0 },
        {
          $set: {
            Name: name,
            Updated_At: getFormattedDateTime(),
          },
        },
      );
    }

    //prepare update fields
    const updateFields = {
      ...(age !== undefined && { Age: age }),
      ...(department !== undefined && { Department: department }),
      ...(phone !== undefined && { Phone: phone }),
      ...(salary !== undefined && { Salary: salary }),
      ...(address !== undefined && { Address: address }),
      ...(isActive !== undefined && { Is_Active: isActive }),
      ...(permissions !== undefined && { Permissions: permissions }),
      Updated_At: getFormattedDateTime(),
    };

    const updatedAdmin = await Admin.findOneAndUpdate(
      { Admin_Id: objectId, Is_Deleted: 0 },
      { $set: updateFields },
      { new: true },
    ).lean();

    return updatedAdmin || null;
  } catch (err) {
    throw new Error(
      "Error while performing update admin: " + (err?.message || ""),
    );
  }
};
// endregion

// region update admin permission
const updateAdminPermission = async (adminId = "", permission = "") => {
  try {
    //validate inputs
    if (!adminId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(adminId);

    const updated = await Admin.findOneAndUpdate(
      { Admin_Id: objectId, Is_Deleted: 0 },
      {
        $set: {
          Permissions: permission || "",
          Updated_At: getFormattedDateTime(),
        },
      },
      { new: true },
    ).lean();

    return updated || null;
  } catch (err) {
    throw new Error(
      "Error while performing update admin permission: " + (err?.message || ""),
    );
  }
};
// endregion

// region check if admin code exists
const isAdminCodeExists = async (adminCode = "") => {
  try {
    if (!adminCode) {
      return false;
    }

    const admin = await Admin.findOne({
      Admin_Code: adminCode || "",
      Is_Deleted: 0,
    }).lean();

    return !!admin;
  } catch (err) {
    throw new Error(
      "Error while checking admin code: " + (err?.message || ""),
    );
  }
};
// endregion



// region exports
export {
  createAdmin,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  updateAdminDetails,
  updateAdminPermission,
  isAdminCodeExists,

};
// endregion
