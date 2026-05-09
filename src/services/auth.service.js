const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { sendOTPMail } = require("../utils/mail.util");

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

module.exports = { register, verifyOtp };