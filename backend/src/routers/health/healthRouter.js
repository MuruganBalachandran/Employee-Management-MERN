// region imports
import express from "express";
const router = express.Router();

// utils
import { getFormattedDateTime, sendResponse } from "../../utils/index.js";

// constants
import { STATUS_CODE, RESPONSE_STATUS } from "../../utils/index.js";
// endregion

// region health check route
router.get("/", (req, res) => {
  // send standard API response to confirm server health
  return sendResponse(
    res,
    STATUS_CODE.OK,
    RESPONSE_STATUS.SUCCESS,
    "API is healthy",
    {
      timestamp: getFormattedDateTime(),
    },
  );
});
// endregion

// region exports
export default router;
// endregion
