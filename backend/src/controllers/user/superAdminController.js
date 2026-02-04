// region imports
import {
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
  ROLE,
} from "../../utils/index.js";

import { deleteUserAccount, findUserById } from "../../queries/index.js";

import { validateObjectId } from "../../validations/helpers/typeValidations.js";
// endregion

// region delete admin
const removeAdmin = async (req = {}, res = {}) => {
  try {
    const { id = "" } = req?.params || {};

    const idError = validateObjectId(id);
    if (idError) {
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }

    const user = await findUserById(id);

    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "User not found",
      );
    }
    // if the user role is super admin , cannot delet
    if (user?.Role === ROLE.SUPER_ADMIN) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Cannot delete Super Admin",
      );
    }

    await deleteUserAccount(user);

    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Admin deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting admin:", err);
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS?.FAILURE || "FAILURE",
      "Error deleting admin",
    );
  }
};
// endregion

// region exports
export { removeAdmin };
// endregion
