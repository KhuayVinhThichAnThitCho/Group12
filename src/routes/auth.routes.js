const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { registerLimiter, verifyOtpLimiter, loginLimiter } = require("../middlewares/rateLimit.middleware");
const { registerRules, verifyOtpRules, loginRules, validate } = require("../middlewares/validate.middleware");

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

router.post(
  "/login",
  loginLimiter,
  loginRules,
  validate,
  authController.login
);

module.exports = router;