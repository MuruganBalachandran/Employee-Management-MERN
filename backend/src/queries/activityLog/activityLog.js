// region imports
import { ActivityLog } from "../../models/index.js";
import { toObjectId, getFormattedDateTime } from "../../utils/index.js";
// endregion

// region createActivity logs

const createActivityLog = async (payload = {}) => {
  try {
    const {
      User_Id = null,
      Email = "",
      Action = "",
      URL = "",
      Status = 0,
      IP = "",
      Duration = "",
      Created_At = "",
      Activity = "",
    } = payload || {};

    const activity = await ActivityLog.create({
      User_Id,
      Email,
      Action,
      URL,
      Status,
      IP,
      Duration,
      Created_At,
      Activity,
    });

    return activity || null;
  } catch (err) {
    throw new Error(
      "Error while performing create activity log: " + (err?.message || ""),
    );
  }
};

// region get activity logs
const getActivityLogs = async (limit = 10, skip = 0, search = "") => {
  try {
    const baseMatch = { Is_Deleted: 0 };

    const searchMatch = search
      ? {
          $or: [
            { Activity: { $regex: search, $options: "i" } },
            { Email: { $regex: search, $options: "i" } },
            { Action: { $regex: search, $options: "i" } },
            { URL: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const pipeline = [
      {
        $facet: {
          //  Logs (filtered)
          logs: [
            { $match: { ...baseMatch, ...searchMatch } },
            { $sort: { Created_At: -1 } },
            { $skip: skip || 0 },
            { $limit: limit || 10 },
            {
              $project: {
                _id: 0,
                Log_Id: 1,
                Activity: 1,
                Method: "$Action",
                URL: 1,
                Status: 1,
                Email: 1,
                IP: 1,
                Duration: 1,
                Created_At: 1,
              },
            },
          ],

          //  Filtered count
          filteredCount: [
            { $match: { ...baseMatch, ...searchMatch } },
            { $count: "count" },
          ],

          //  Overall count (NO SEARCH)
          overallCount: [
            { $match: baseMatch },
            { $count: "count" },
          ],
        },
      },
    ];

    const result = await ActivityLog.aggregate(pipeline);

    const logs = result?.[0]?.logs || [];
    const filteredTotal =
      result?.[0]?.filteredCount?.[0]?.count || 0;
    const overallTotal =
      result?.[0]?.overallCount?.[0]?.count || 0;

    return {
      logs,
      total: filteredTotal,        // filtered
      overallTotal,                // real DB total
      skip,
      limit,
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(filteredTotal / limit),
    };
  } catch (err) {
    throw new Error(
      "Error fetching activity logs: " + (err?.message || "")
    );
  }
};
// endregion


// region delete activity log by id
const deleteActivityLog = async (logId = "") => {
  try {
    //validate id
    if (!logId) {
      return null;
    }

    const objectId = toObjectId(logId);

    const deleted = await ActivityLog.findOneAndUpdate(
      { Log_Id: objectId, Is_Deleted: 0 },
      {
        $set: {
          Is_Deleted: 1,
          Updated_At: getFormattedDateTime(),
        },
      },
      { new: true },
    ).lean();

    return deleted || null;
  } catch (err) {
    throw new Error(
      "Error while deleting activity log: " + (err?.message || ""),
    );
  }
};
// endregion
// region exports
export {
  createActivityLog,
  getActivityLogs,
  deleteActivityLog
}
// endregion