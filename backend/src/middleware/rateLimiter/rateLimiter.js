// region package imports
import rateLimit from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";
import { RESPONSE_STATUS } from "../../utils/constants/constants.js";
// endregion

// region helper - build key
const buildKey = (req) => {
  const ip = ipKeyGenerator(req);
  const email = req.body?.Email?.toLowerCase() || "no-email";
  return `${ip}|${email}`;
};
// endregion

// region LOGIN LIMITER
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildKey,
  message: {
    status: RESPONSE_STATUS?.FAILURE || "FAILURE",
    message: "Too many login attempts. Try again later.",
  },
});
// endregion

// region SIGNUP LIMITER
const signupLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: buildKey,
  message: {
    status: RESPONSE_STATUS?.FAILURE || "FAILURE",
    message: "Too many signup attempts. Try again later.",
  },
});
// endregion

// region exports
export { loginLimiter, signupLimiter };
// endregion
