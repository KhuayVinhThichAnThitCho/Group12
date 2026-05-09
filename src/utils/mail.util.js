const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOTPMail = async (toEmail, otpCode) => {
  await transporter.sendMail({
    from: `"App Name" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: "Ma OTP kich hoat tai khoan",
    html: `
      <h3>Xac nhan tai khoan cua ban</h3>
      <p>Ma OTP cua ban la:</p>
      <h2 style="color: #2E75B6; letter-spacing: 4px">${otpCode}</h2>
      <p>Ma co hieu luc trong <strong>10 phut</strong>.</p>
      <p>Neu ban khong yeu cau, hay bo qua email nay.</p>
    `,
  });
};

module.exports = { sendOTPMail };