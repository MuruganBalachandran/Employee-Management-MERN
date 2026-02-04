// region imports
// package imports
import express from "express";
import cors from "cors";

//  config imports
import { corsConfig } from "./config/index.js";

//  middleware imports
import {
  jsonValidator,
  logger,
  errorHandler,
  notFound,
} from "./middleware/index.js";

//  router imports
import {
  healthRouter,
  userRouter,
  superAdminRouter,
  authRouter,
  employeeRouter,
} from "./routers/index.js";
// endregion

//  server initialization
const app = express();
// endregion

// region  middleware

// log all requests (moved to top for better observability)
app.use(logger);

// parse JSON body
app.use(express.json());

// validate JSON format
app.use(jsonValidator);

// apply CORS rules globally
app.use(cors(corsConfig));
// endregion

// region API routes
app.use("/api/health", healthRouter);
app.use("/api/users", userRouter); // /me routes
app.use("/api/auth", authRouter); // login, signup
app.use("/api/employees", employeeRouter); // admin crud employees
app.use("/api/super-admin", superAdminRouter);
// endregion

//  404 handler
app.use(notFound);
// endregion

//  error handler
app.use(errorHandler);
// endregion

// region exports
export default app;
// endregion
