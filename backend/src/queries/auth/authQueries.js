// region model imports
import User from "../../models/user/userModel.js";
// endregion

// region find user by email
const findUserByEmail = async (email = "") => {
  const users = await User.aggregate([
    {
      $match: {
        Email: email,
        Is_Deleted: 0,
      },
    },
    {
      $project: {
        _id: 1,
        User_Id: 1,
        Name: 1,
        Email: 1,
        Password: 1,
        Role: 1,
        Is_Deleted: 1,
        Created_At: 1,
        Updated_At: 1,
      },
    },
  ]);

  return users?.length > 0 ? users[0] : null;
};
// endregion

// region exports
export { findUserByEmail };
// endregion
