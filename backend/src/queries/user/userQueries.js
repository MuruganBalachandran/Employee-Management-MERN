// region model imports
import mongoose from "mongoose";
import User from "../../models/user/userModel.js";
import { getFormattedDateTime, ROLE } from "../../utils/index.js";
// endregion

// region update user profile
const updateUserProfile = async (user = {}, updateData = {}) => {
  try {
    const allowedFields = [
      "Name",
      "Password",
      "Age",
      "Department",
      "Phone",
      "Address",
    ];
    let isChanged = false;

    // Iterate through allowed fields and update if changed
    for (const field of allowedFields) {
      if (
        updateData[field] !== undefined &&
        updateData[field] !== user[field]
      ) {
        // Update Name with trim, other fields directly
        user[field] =
          field === "Name" ? updateData[field].trim() || "" : updateData[field];
        isChanged = true;
      }
    }

    // Return null if no fields changed
    if (!isChanged) return null;

    // Update manual Updated_At timestamp
    user.Updated_At = getFormattedDateTime() || new Date().toISOString();

    // Save updated user (pre-save hashes password if changed)
    await user.save();

    // Return updated user
    return user;
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw err;
  }
};
// endregion

// region delete user account
const deleteUserAccount = async (target = {}) => {
  try {
    let user = target;

    // If target is an ID, find the user first
    if (typeof target === "string" || mongoose.isValidObjectId(target)) {
      user = await User.findById(target);
    }

    if (!user || user.Is_Deleted === 1) return null;

    // Prevent deletion of super admin
    if (user.Role === ROLE.SUPER_ADMIN) {
      throw new Error("Super Admin account cannot be deleted");
    }

    // Soft-delete user account
    user.Is_Deleted = 1;
    user.Updated_At = getFormattedDateTime() || new Date().toISOString();

    await user.save();
    return user;
  } catch (err) {
    console.error("Error deleting user account:", err);
    throw err;
  }
};
// endregion

// region admin management (Super Admin only checks handled in controller)
const findSuperAdmin = async () => {
  try {
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
      { $limit: 1 },
    ]);

    return admins.length > 0 ? admins[0] : null;
  } catch (err) {
    console.error("Error finding super admin:", err);
    throw err;
  }
};

/**
 * Fetches an active user by their primary ID using aggregate.
 */
const findUserById = async (id = "") => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
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
      { $limit: 1 },
    ]);

    return users.length > 0 ? users[0] : null;
  } catch (err) {
    console.error("Error finding user by ID:", err);
    throw err;
  }
};

/**
 * Creation hook specifically for the initial Super Admin account.
 */
const createInitialSuperAdmin = async (email = "", password = "") => {
  try {
    const superAdmin = new User({
      Name: "Super Admin",
      Email: email.trim().toLowerCase() || "",
      Password: password,
      Role: ROLE.SUPER_ADMIN,
      Department: "Administration",
      Phone: "000-000-0000",
      Address: {
        Line1: "Admin HQ",
        City: "Admin City",
        State: "AD",
        ZipCode: "00000",
      },
    });
    await superAdmin.save();
    return superAdmin;
  } catch (err) {
    console.error("Error creating initial super admin:", err);
    throw err;
  }
};

// region exports
export {
  updateUserProfile,
  deleteUserAccount,
  findSuperAdmin,
  findUserById,
  createInitialSuperAdmin,
};
// endregion
