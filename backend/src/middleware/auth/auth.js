// region imports
import {
  verifyToken,
  sendResponse,
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/index.js";
import { User } from "../../models/index.js";
// endregion

// authentication and authorization
// region auth middleware
const auth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Authentication - verify token
      const authHeader = req?.headers?.authorization;

      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

      if (!token) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE,
          "Unauthorized access",
        );
      }

      const decoded = verifyToken(token);

      if (!decoded?._id) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE,
          "Invalid token",
        );
      }

      const user = await User.findOne({ _id: decoded._id, Is_Deleted: 0 });

      if (!user) {
        return sendResponse(
          res,
          STATUS_CODE?.UNAUTHORIZED || 401,
          RESPONSE_STATUS?.FAILURE,
          "Unauthorized access",
        );
      }

      // Attach user to request
      req.user = user;

      // STEP 2: Authorization - check role if roles are specified
      if (allowedRoles?.length > 0) {
        const userRole = user?.Role;

        if (!allowedRoles?.includes(userRole)) {
          return sendResponse(
            res,
            STATUS_CODE?.UNAUTHORIZED || 401,
            RESPONSE_STATUS?.FAILURE,
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
        RESPONSE_STATUS?.FAILURE,
        "Unauthorized access",
      );
    }
  };
};

// exports
export { auth };
