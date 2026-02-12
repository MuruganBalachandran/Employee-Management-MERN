// region imports
// package imports
import express from "express";
// controller imports
import {
  login,
  logout,
  getProfile
} from "../../controllers/auth/authController.js";
// middleware imports
import { auth, rateLimiter } from "../../middleware/index.js";
// endregion

// region router initialization
const router = express.Router();
// endregion

// region routes
router.post("/login", rateLimiter("Login"), login);
router.post("/logout", auth(), logout);
router.get("/profile", auth(), getProfile);
// endregion

// region exports
export default router;
// endregion