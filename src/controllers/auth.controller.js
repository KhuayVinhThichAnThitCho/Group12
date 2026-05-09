const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await authService.register({ name, email, password });
    return res.status(200).json({
      message: "Dang ky thanh cong! Vui long kiem tra email de nhan OTP.",
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp({ email, otp });
    return res.status(200).json({
      message: "Kich hoat tai khoan thanh cong! Ban co the dang nhap.",
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { register, verifyOtp };