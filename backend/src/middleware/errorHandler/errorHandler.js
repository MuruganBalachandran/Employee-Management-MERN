// region imports
// package imports
import chalk from "chalk";
// utils imports
import { sendResponse } from "../../utils/common/commonFunctions.js";
//  constants imports
import {
  STATUS_CODE,
  RESPONSE_STATUS,
} from "../../utils/constants/constants.js";
// endregion

// region error handler middleware
const errorHandler = (err, req, res, next) => {
  try {
    // log the error message in red
    console?.error?.(chalk?.red?.("[ERROR]"), err?.message || "Unknown error");
    console?.log?.("from global error handler");

    // determine status code; default to 500
    const statusCode =
      err?.statusCode ||
      err?.status ||
      STATUS_CODE?.INTERNAL_SERVER_ERROR ||
      500;

    // determine error message; default to generic server message
    const message = err?.message || "Internal server error";

    // send standardized error response
    return sendResponse(res, statusCode, RESPONSE_STATUS.FAILURE, message);
  } catch (handlerErr) {
    // fallback if error occurs inside the error handler itself
    return sendResponse(
      res,
      STATUS_CODE?.INTERNAL_SERVER_ERROR || 500,
      RESPONSE_STATUS.FAILURE,
      "Something went wrong, please try again later",
    );
  }
};
// endregion

// region exports
export default errorHandler;
// endregion
