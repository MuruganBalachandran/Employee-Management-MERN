// region imports
// utils imports
import { sendResponse } from "../../utils/common/commonFunctions.js";
// constants imports
import {
  STATUS_CODE,
  VALIDATION_MESSAGES,
  RESPONSE_STATUS,
} from "../../utils/constants/constants.js";
// endregion

// region json validator middleware
const jsonValidator = (err, req, res, next) => {
  // check the type
  //SyntaxError-  built-in error class
  if (
    err instanceof SyntaxError && // Checks the type of error object.
    (err.status === 400 || err.statusCode === 400) && // BAD REQUEST
    "body" in err //  Error came from request body parsing
  ) {
    return sendResponse(
      res,
      STATUS_CODE?.BAD_REQUEST || 400,
      RESPONSE_STATUS?.FAILURE,
      VALIDATION_MESSAGES?.INVALID_JSON_PAYLOAD || "Invalid JSON payload",
    );
  }
  next();
};
// endregion

// region exports
export default jsonValidator;
// endregion
