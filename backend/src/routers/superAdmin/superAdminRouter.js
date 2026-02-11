// region imports
import express from "express";
import { auth, rateLimiter } from "../../middleware/index.js";
import {
  listAdmins,
  getAdmin,
  createNewAdmin,
  removeAdmin,
} from "../../controllers/superAdmin/superAdminController.js";
// endregion

// region router initialization
const router = express.Router();
// endregion

// region super admin routes
router.use(auth("SUPER_ADMIN"));

router.get("/", listAdmins);
router.get("/:id", getAdmin);
router.post("/",rateLimiter("Register"), createNewAdmin);
router.delete("/:id", removeAdmin);
// endregion

// region exports
export default router;
// endregion
