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
// region fetch activity logs
const getActivityLogs = async (limit = 10, skip = 0, search = "") => {
  try {
    //build match
    const match = { Is_Deleted: 0 };

    if (search) {
      match.$or = [
        { Activity: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { Action: { $regex: search, $options: "i" } },
        { URL: { $regex: search, $options: "i" } },
      ];
    }

    //aggregation pipeline
    const pipeline = [
      { $match: match },
      { $sort: { Created_At: -1 } },
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
      {
        $facet: {
          logs: [{ $skip: skip || 0 }, { $limit: limit || 10 }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = (await ActivityLog.aggregate(pipeline)) || [];

    const logs = result?.[0]?.logs || [];
    const total = result?.[0]?.totalCount?.[0]?.count || 0;

    return {
      logs,
      total,
      skip: skip || 0,
      limit: limit || 10,
      currentPage: Math.floor((skip || 0) / (limit || 10)) + 1,
      totalPages: Math.ceil(total / (limit || 10)),
    };
  } catch (err) {
    throw new Error("Error fetching activity logs: " + (err?.message || ""));
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