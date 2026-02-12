// region imports
import ActivityLog from "../../models/activityLog/ActivityLogModel.js";
import { getFormattedDateTime, verifyToken } from "../../utils/index.js";
// endregion


// region logger middleware
const logger = (req = {}, res = {}, next) => {
  const startTime = Date.now();

  //extract user from token (non-blocking)
  const token = req?.cookies?.token || "";
  let tokenUser = null;

  if (token) {
    try {
      tokenUser = verifyToken(token) || null;
    } catch (err) {
      tokenUser = null;
    }
  }

  //keep original send
  const originalSend = res.send;

  res.send = async function (body) {
    try {
      //extract activity message
      let activity = "";
      let emailFromBody = "";

      try {
        const parsed =
          typeof body === "string" ? JSON.parse(body) : body || {};
        activity = parsed?.message || parsed?.msg || "";
        emailFromBody = parsed?.user?.email || parsed?.email || "";
      } catch (e) {
        activity = body?.toString?.() || "";
      }

      //calculate duration
      const duration = Date.now() - startTime;

      //determine user info
      const userId =
        req?.user?.User_Id ||
        tokenUser?.User_Id ||
        null;

      const email =
        req?.user?.email ||
        tokenUser?.email ||
        emailFromBody ||
        "Guest";

      //build log object
      const logData = {
        User_Id: userId,
        Email: email,
        Action: req?.method || "UNKNOWN",
        URL: req?.originalUrl || req?.url || "unknown-url",
        Status: res?.statusCode || 0,
        IP: req?.ip || req?.connection?.remoteAddress || "unknown-ip",
        Duration: `${duration}ms`,
        Time: getFormattedDateTime() || "unknown-time",
        Activity: activity,
      };

      //print
      console.log(
        `[${logData?.Time}] ${logData?.Action} ${logData?.URL} ${logData?.Status} ${logData?.Duration}`
      );

      //save log
      ({
        User_Id: logData?.User_Id,
        Email: logData?.Email,
        Action: logData?.Action,
        URL: logData?.URL,
        Status: logData?.Status,
        IP: logData?.IP,
        Duration: logData?.Duration,
        Created_At: logData?.Time,
        Activity: logData?.Activity,
      });
    } catch (err) {
      console.error("Logger error:", err);
    }

    //send response
    return originalSend.call(this, body);
  };

  next();
};
// endregion


// region exports
export default logger;
// endregion
