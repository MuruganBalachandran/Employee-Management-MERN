// region imports
import { User } from "../../models/index.js";
// endregion

// region find user by email
const findUserByEmail = async (email = "") => {
  try {
    return await User.findOne({
      Email: email || "",
      Is_Deleted: 0,
    }).lean();
  } catch (err) {
    throw new Error(
      "Error while finding user by email: " + (err?.message || ""),
    );
  }
};
// endregion

// region get user profile by User_Id
const getProfileQuery = async (userId = "") => {
  try {
    //validate user id
    if (!userId) {
      return null;
    }

    const user =
      (await User.findOne({
        User_Id: userId,
        Is_Deleted: 0,
      }).lean()) || null;

    return user;
  } catch (err) {
    throw new Error("Error while fetching profile: " + (err?.message || ""));
  }
};
// endregion

// region check if email exists
const isEmailExists = async (email = "") => {
  try {
    if (!email) return false;
    const user = await User.findOne({
      Email: email?.trim()?.toLowerCase() || "",
      Is_Deleted: 0,
    }).lean();
    return !!user;
  } catch (err) {
    throw new Error(
      "Error while checking if email exists: " + (err?.message || ""),
    );
  }
};
// endregion

// region exports
export { findUserByEmail, getProfileQuery, isEmailExists };
// endregion
