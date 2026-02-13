// region imports
// libraries
import mongoose from "mongoose";

// models
import { User, Admin } from "../../models/index.js";

// utils
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region create admin
const createAdmin = async (payload = {}) => {
  try {
    // extract payload
    const {
      Name = "",
      Email = "",
      Password = "",
      Age,
      Phone,
      Salary,
      Address = {},
      Joining_Date,
      Admin_Code = "",
    } = payload || {};

    // create user
    const user = await new User({
      Name: Name || "",
      Email: Email || "",
      Password: Password || "",
      Role: ROLE?.ADMIN || "ADMIN",
    })?.save?.();

    // normalize address
    const adminAddress = {
      Line1: Address?.line1 || "",
      Line2: Address?.line2 || "",
      City: Address?.city || "",
      State: Address?.state || "",
      ZipCode: Address?.zipCode || "",
    };

    // create admin profile
    const admin = await new Admin({
      User_Id: user?.User_Id || null,
      Age,
      Phone,
      Salary,
      Address: adminAddress,
      Joining_Date,
      Admin_Code: Admin_Code || "",
      Permissions: "GRANTED",
    })?.save?.();

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
    const safeLimit = Number(limit) || 20;
    const safeSkip = Number(skip) || 0;

    const userSearchMatch = search
      ? {
          $or: [
            { "user.Name": { $regex: search, $options: "i" } },
            { "user.Email": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      { $match: { Is_Deleted: 0 } },

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
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $facet: {
          // paginated + filtered admins
          admins: [
            { $match: userSearchMatch },
            { $sort: { Created_At: -1 } },
            { $skip: safeSkip },
            { $limit: safeLimit },
            {
              $project: {
                Admin_Id: 1,
                User_Id: 1,
                Age: 1,
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

          // filtered count (search applied)
          filteredCount: [
            { $match: userSearchMatch },
            { $count: "count" },
          ],

          // overall count (NO search)
          overallCount: [
            { $match: { Is_Deleted: 0 } },
            { $count: "count" },
          ],
        },
      },
    ];

    const result = await Admin.aggregate(pipeline);

    return {
      admins: result?.[0]?.admins || [],
      filteredTotal: result?.[0]?.filteredCount?.[0]?.count || 0,
      overallTotal: result?.[0]?.overallCount?.[0]?.count || 0,
    };
  } catch (err) {
    throw new Error(
      "Error while performing get all admins: " + (err?.message || "")
    );
  }
};
// endregion

// region get admin by id
const getAdminById = async (id = "") => {
  try {
    // validate id
    if (!id) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const result =
      (await Admin?.aggregate?.([
        { $match: { Admin_Id: objectId, Is_Deleted: 0 } },
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
        {
          $project: {
            Admin_Id: 1,
            User_Id: 1,
            Age: 1,
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
    // validate id
    if (!adminId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(adminId);

    const doc = await Admin?.findOneAndUpdate?.(
      { Admin_Id: objectId, Is_Deleted: 0 },
      { $set: { Is_Deleted: 1 } },
      { new: true },
    )?.lean?.();

    if (!doc) {
      return null;
    }

    // delete linked user
    if (doc?.User_Id) {
      await User?.findOneAndUpdate?.(
        { User_Id: doc?.User_Id || null, Is_Deleted: 0 },
        { $set: { Is_Deleted: 1 } },
      );
    }

    return doc || null;
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
    // validate id
    if (!adminId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(adminId);

    const existingAdmin = await Admin?.findOne?.({
      Admin_Id: objectId,
      Is_Deleted: 0,
    })?.lean?.();

    if (!existingAdmin) {
      return null;
    }

    const { name, age, phone, salary, address, isActive } = payload || {};

    // update user name
    if (name !== undefined) {
      await User?.findOneAndUpdate?.(
        { User_Id: existingAdmin?.User_Id || null, Is_Deleted: 0 },
        {
          $set: {
            Name: name || "",
            Updated_At: getFormattedDateTime(),
          },
        },
      );
    }

    const updateFields = {
      ...(age !== undefined && { Age: age }),
      ...(phone !== undefined && { Phone: phone }),
      ...(salary !== undefined && { Salary: salary }),
      ...(address !== undefined && { Address: address }),
      ...(isActive !== undefined && { Is_Active: isActive }),
      Updated_At: getFormattedDateTime(),
    };

    await Admin?.findOneAndUpdate?.(
      { Admin_Id: objectId, Is_Deleted: 0 },
      { $set: updateFields },
    );

    return await getAdminById(adminId);
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
    // validate id
    if (!adminId) {
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(adminId);

    const updated = await Admin?.findOneAndUpdate?.(
      { Admin_Id: objectId, Is_Deleted: 0 },
      {
        $set: {
          Permissions: permission || "",
          Updated_At: getFormattedDateTime(),
        },
      },
      { new: true },
    )?.lean?.();

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
    // validate code
    if (!adminCode) {
      return false;
    }

    const admin = await Admin?.findOne?.({
      Admin_Code: adminCode || "",
      Is_Deleted: 0,
    })?.lean?.();

    return !!admin;
  } catch (err) {
    throw new Error("Error while checking admin code: " + (err?.message || ""));
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
