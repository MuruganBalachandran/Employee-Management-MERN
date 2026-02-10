import { getFormattedDateTime } from "../../utils/index.js"

// region logger middleware
const logger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    // calculate request duration
    const duration = Date.now() - startTime;

    // current timestamp in ISO format
    const timestamp = getFormattedDateTime() || "unknown-time";

    //  get method, url and status
    const method = req?.method || "UNKNOWN";
    const url = req?.originalUrl || req?.url || "unknown-url";
    const status = res?.statusCode || 0;

    // log formatted output
    console.log(
      `[${timestamp}] ${method} ${url} ${status} ${duration}ms`
    );
  });

  next();
};
// endregion

// region exports
export default logger;
// endregion
