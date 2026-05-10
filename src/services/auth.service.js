const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendOTPMail, sendForgotPasswordOTPEmail } = require("../utils/mail.util");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error("Email da duoc su dung.");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otpCode = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
    isVerified: false,
    otpCode,
    otpExpires,
  });

  await sendOTPMail(email, otpCode);
};

const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("Email khong ton tai.");
    error.status = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("Tai khoan da duoc kich hoat.");
    error.status = 400;
    throw error;
  }

  if (user.otpCode !== otp) {
    const error = new Error("OTP khong hop le.");
    error.status = 400;
    throw error;
  }

  if (new Date() > user.otpExpires) {
    const error = new Error("OTP da het han.");
    error.status = 400;
    throw error;
  }

  await user.update({
    isVerified: true,
    otpCode: null,
    otpExpires: null,
  });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error("Email hoac mat khau khong dung.");
    error.status = 401;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error("Tai khoan chua xac thuc OTP. Vui long kiem tra email.");
    error.status = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Email hoac mat khau khong dung.");
    error.status = 401;
    throw error;
  }

  const payload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

  const redirectUrl = user.role === "admin" ? "/admin/profile" : "/user/profile";

  return { token, redirectUrl };
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const otpCode = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  user.otpCode = otpCode;
  user.otpExpires = otpExpires;
  await user.save();

  await sendForgotPasswordOTPEmail(email, otpCode);

  return {
    email,
    message: "OTP đặt lại mật khẩu đã được gửi về email.",
  };
};

const resetPassword = async ({ email, otpCode, newPassword }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (user.otpCode !== otpCode) {
    throw new Error("OTP không chính xác");
  }

  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new Error("OTP đã hết hạn");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otpCode = null;
  user.otpExpires = null;

  await user.save();

  return {
    message: "Đặt lại mật khẩu thành công.",
  };
};

const editProfile = async (userId, data) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User không tồn tại");
  }

  const allowedFields = ["name", "phone", "address", "avatar"];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    role: user.role,
  };
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  editProfile,
};
