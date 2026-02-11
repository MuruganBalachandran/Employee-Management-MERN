// region model imports
import User from "../../models/user/userModel.js";
// endregion

// region find user by email
const findUserByEmail = async (email = "") => {
  try {
      return await User.findOne({
    Email: email,
    Is_Deleted: 0,
  }).lean();
  } catch (err) {
    throw new Error("Error while find user by email",err);
  }
};
// endregion

// region exports
export { findUserByEmail };
// endregion
