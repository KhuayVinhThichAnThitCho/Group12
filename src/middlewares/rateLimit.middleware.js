const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Qua nhieu yeu cau. Vui long thu lai sau 10 phut.",
  },
});

const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Qua nhieu yeu cau. Vui long thu lai sau 10 phut.",
  },
});

module.exports = { registerLimiter, verifyOtpLimiter };