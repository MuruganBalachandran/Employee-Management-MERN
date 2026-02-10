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
      // Authentication - verify token
      const authHeader = req?.headers?.authorization;

      // extract token from header
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

      const decoded = token && verifyToken(token);

      if (!token || !decoded?.User_Id) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE || "FAILURE",
          "Unauthorized access",
        );
      }

      const user = await User.findOne({ User_Id: decoded.User_Id, Is_Deleted: 0 });

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

      //Authorization - check role if roles are specified
      if (allowedRoles?.length > 0) {
        const userRole = user?.Role;

        if (!allowedRoles?.includes(userRole)) {
          return sendResponse(
            res,
            STATUS_CODE?.UNAUTHORIZED || 401,
            RESPONSE_STATUS?.FAILURE || "FAILURE",
            "Unauthorized access",
          );
        }
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

// exports
export { auth };
