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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, redirectUrl } = await authService.login({ email, password });
    return res.status(200).json({
      message: "Dang nhap thanh cong!",
      token,
      redirectUrl,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const result = await authService.editProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Cập nhật profile thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  editProfile,
};
