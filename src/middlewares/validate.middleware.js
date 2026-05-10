const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  next();
};

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

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  handleValidationErrors,
];

const resetPasswordValidation = [
  body("email").isEmail().withMessage("Email không hợp lệ"),

  body("otpCode").notEmpty().withMessage("OTP không được để trống"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Mật khẩu xác nhận không khớp");
    }
    return true;
  }),

  handleValidationErrors,
];

const editProfileValidation = [
  body("name").optional().notEmpty().withMessage("Tên không được để trống"),

  body("phone")
    .optional()
    .isLength({ min: 9, max: 20 })
    .withMessage("Số điện thoại không hợp lệ"),

  body("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Địa chỉ tối đa 255 ký tự"),

  body("avatar").optional().isURL().withMessage("Avatar phải là URL hợp lệ"),

  handleValidationErrors,
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerRules,
  verifyOtpRules,
  loginRules,
  forgotPasswordValidation,
  resetPasswordValidation,
  editProfileValidation,
  validate,
};
