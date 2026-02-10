// region imports
// package imports
import express from "express";
// controller imports
import {
  login,
  logout,
} from "../../controllers/auth/authController.js";
// middleware imports
import { auth, loginLimiter } from "../../middleware/index.js";
// endregion

// region router initialization
const router = express.Router();
// endregion

// region routes
router.post("/login", loginLimiter, login);
router.post("/logout", auth(), logout);
// endregion

// region exports
export default router;
// endregion