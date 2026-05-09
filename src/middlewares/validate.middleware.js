const { body, validationResult } = require("express-validator");

const registerRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Ten khong duoc de trong.")
    .isLength({ min: 2, max: 50 }).withMessage("Ten phai tu 2 den 50 ky tu."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email khong duoc de trong.")
    .isEmail().withMessage("Email khong hop le."),

  body("password")
    .notEmpty().withMessage("Mat khau khong duoc de trong.")
    .isLength({ min: 8 }).withMessage("Mat khau toi thieu 8 ky tu.")
    .matches(/[A-Z]/).withMessage("Mat khau phai co it nhat 1 chu hoa.")
    .matches(/[0-9]/).withMessage("Mat khau phai co it nhat 1 so."),
];

const verifyOtpRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email khong duoc de trong.")
    .isEmail().withMessage("Email khong hop le."),

  body("otp")
    .trim()
    .notEmpty().withMessage("OTP khong duoc de trong.")
    .isLength({ min: 6, max: 6 }).withMessage("OTP phai co 6 ky tu."),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email khong duoc de trong.")
    .isEmail().withMessage("Email khong hop le."),

  body("password")
    .notEmpty().withMessage("Mat khau khong duoc de trong."),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerRules, verifyOtpRules, loginRules, validate };