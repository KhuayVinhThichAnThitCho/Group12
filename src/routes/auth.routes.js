const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { registerLimiter, verifyOtpLimiter } = require("../middlewares/rateLimit.middleware");
const { registerRules, verifyOtpRules, validate } = require("../middlewares/validate.middleware");

router.post(
  "/register",
  registerLimiter,
  registerRules,
  validate,
  authController.register
);

router.post(
  "/verify-otp",
  verifyOtpLimiter,
  verifyOtpRules,
  validate,
  authController.verifyOtp
);

module.exports = router;