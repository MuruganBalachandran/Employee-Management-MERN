// region imports
//  utils
import {
  RESPONSE_STATUS,
  sendResponse,
  STATUS_CODE,
} from "../../utils/index.js";
import { validateObjectId } from "../../validations/helpers/typeValidations.js";

//  model
import { deleteActivityLog, getActivityLogs } from "../../queries/index.js";
// endregion

// region fetch activity logs
const fetchActivityLogs = async (req = {}, res = {}, next) => {
  try {
    //validate query params
    const limit = Math.min(100, Number(req?.query?.limit) || 20);

    const skip =
      req?.query?.skip !== undefined
        ? Math.max(0, Number(req?.query?.skip) || 0)
        : (Math.max(1, Number(req?.query?.page) || 1) - 1) * limit;

    const search = req?.query?.search || "";

    //fetch logs
    const { logs = [], total = 0 } =
      (await getActivityLogs(limit, skip, search)) || {};

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Activity logs fetched successfully",
      {
        logs,
        total,
        skip,
        limit,
        currentPage: Math.floor(skip / limit) + 1,
        totalPages: Math.ceil((total || 0) / limit),
      },
    );
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    next && next(err);
  }
};
// endregion

// region delete activity log controller
const removeActivityLog = async (req = {}, res = {}, next) => {
  try {
    const { id = "" } = req?.params || {};

    //validate id
    const idError = validateObjectId(id);
    if (idError) {
      //send response
      return sendResponse(
        res,
        STATUS_CODE?.BAD_REQUEST || 400,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        idError,
      );
    }

    //delete log
    const deleted = await deleteActivityLog(id);
    if (!deleted) {
      //send response
      return sendResponse(
        res,
        STATUS_CODE?.NOT_FOUND || 404,
        RESPONSE_STATUS?.FAILURE || "FAILURE",
        "Activity log not found",
      );
    }

    //send response
    return sendResponse(
      res,
      STATUS_CODE?.OK || 200,
      RESPONSE_STATUS?.SUCCESS || "SUCCESS",
      "Activity log deleted successfully",
    );
  } catch (err) {
    console.error("Error deleting activity log:", err);
    next && next(err);
  }
};
// endregion

// region exports
export { fetchActivityLogs, removeActivityLog };
// endregion
