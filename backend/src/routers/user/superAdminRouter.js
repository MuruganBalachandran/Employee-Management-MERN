// region imports
import express from "express";
import { auth } from "../../middleware/index.js";
import { removeAdmin } from "../../controllers/user/superAdminController.js";
import { signup } from "../../controllers/auth/authController.js";
// endregion

// region router initialization
const router = express.Router();
// endregion

// region super admin routes
router.use(auth("SUPER_ADMIN"));

router.post("/create-admin", signup);
router.delete("/delete-admin/:id", removeAdmin);
// endregion

// region exports
export default router;
// endregion
