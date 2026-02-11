// region imports
import {
  verifyToken,
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";
import { User } from "../../models/index.js";
// endregion

// region auth middleware
const auth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Authentication - verify token from cookie
      const token = req?.cookies?.token; // <-- read JWT from cookie

      if (!token) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Unauthorized access",
        );
      }

      const decoded = verifyToken(token);

      if (!decoded?.User_Id) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Unauthorized access",
        );
      }

      const user = await User.findOne({
        User_Id: decoded.User_Id,
        Is_Deleted: 0,
      });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Unauthorized access",
        );
      }

      // Attach user to request
      req.user = user;

      // Authorization - check role if roles are specified
      if (allowedRoles?.length > 0 && !allowedRoles.includes(user?.Role)) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Unauthorized access",
        );
      }

      // User is authenticated (and authorized if roles were checked)
      next();
    } catch (err) {
      return sendResponse(
        res,
        STATUS_CODE?.UNAUTHORIZED || 401,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Unauthorized access",
      );
    }
  };
};
// endregion

// region exports
export { auth };
// endregion
