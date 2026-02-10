// region model imports
import User from "../../models/user/userModel.js";
// endregion

// region find user by email
const findUserByEmail = async (email = "") => {
  return await User.findOne({
    Email: email,
    Is_Deleted: 0,
  }).lean();
};
// endregion

// region exports
export { findUserByEmail };
// endregion
