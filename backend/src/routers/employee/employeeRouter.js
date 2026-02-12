// region imports
// package imports
import express from "express";

// middleware imports
import { auth, rateLimiter } from "../../middleware/index.js";

// controller imports
import {
  listEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployeeDetails,
  removeEmployee,
  checkEmail,
  checkEmployeeCode,
} from "../../controllers/employee/employeeController.js";
// endregion

// region router initialization
const router = express.Router();
// endregion

// region employee routes
router.use(auth("ADMIN", "SUPER_ADMIN"));

// Validation routes (before other routes to avoid conflicts)
router.post("/check-email", checkEmail);
router.post("/check-code", checkEmployeeCode);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", rateLimiter("Register"), createNewEmployee);
router.patch("/:id", updateEmployeeDetails);
router.delete("/:id", removeEmployee);
// endregion

// region exports
export default router;
// endregion
