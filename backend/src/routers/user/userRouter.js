// region imports
// package imports
import express from "express";

// middleware imports
import { auth } from "../../middleware/index.js"; // verifies JWT and attaches req.user

// controller imports
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "../../controllers/user/userController.js";
// endregion

// region router initialization
const router = express.Router();
// endregion

// region protected routes

router.use(auth());

router.get("/getProfile", getProfile);
router.patch("/updateProfile", updateProfile);
router.delete("/deleteProfile", deleteAccount);

// endregion

// region exports
export default router;
// endregion
