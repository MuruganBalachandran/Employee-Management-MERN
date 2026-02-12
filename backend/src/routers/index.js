// region imports
import express from "express";

import activityLogRouter from "./activityLog/activityLogRouter.js";
import healthRouter from "./health/healthRouter.js";
import employeeRouter from "./employee/employeeRouter.js";
import superAdminRouter from "./superAdmin/superAdminRouter.js";
import authRouter from "./auth/authRouter.js";

const routers = express.Router();

// region API routes
routers.use("/health", healthRouter);
routers.use("/auth", authRouter);
routers.use("/employees", employeeRouter);
routers.use("/super-admin", superAdminRouter);
routers.use("/activity-log", activityLogRouter);
// endregion

export default routers;
