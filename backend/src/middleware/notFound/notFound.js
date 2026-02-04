// region imports
// utils import for standardized API responses
import { sendResponse } from "../../utils/common/commonFunctions.js";
// constants import for status codes
import {
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/constants/constants.js";
// endregion

// region not found middleware

const notFound = (req, res, next) => {
  // immediately send 404 response for unmatched routes
  return sendResponse(
    res, // Express response object
    STATUS_CODE?.NOT_FOUND || 404, // HTTP 404
    RESPONSE_STATUS?.FAILURE || "", // status
    "Route not found", // descriptive message
  );
};
// endregion

// region exports
export default notFound;
// endregion
