import nodemailer from "nodemailer";
import { conf } from "../configs/env.js";

if (!conf.smtpHost || !conf.smtpUser || !conf.smtpPass) {
  console.warn("⚠️ SMTP credentials missing. Email sending disabled.");
}

const transporter = nodemailer.createTransport({
  host: conf.smtpHost,
  port: Number(conf.smtpPort),
  secure: false, // ✅ required for port 587
  auth: {
    user: conf.smtpUser,
    pass: conf.smtpPass,
  },
});

// Optional but HIGHLY recommended
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP connection failed:", err.message);
  } else {
    console.log("✅ SMTP server ready");
  }
});

export const sendVerificationOTP = async (email, otp, projectName, customization = {}) => {
  const {
    logoUrl = "",
    primaryColor = "#4f46e5",
    subjectLine = `Your Verification Code for ${projectName}`,
    footerText = "Secure Identity for Developers",
  } = customization;

  const mailOptions = {
    from: `"${projectName}" <${conf.smtpUser}>`,
    to: email,
    subject: subjectLine,
    html: `
      <div style="font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 20px; background: #ffffff; border: 1px solid #e5e7eb;">
        ${logoUrl ? `<div style="text-align: center; margin-bottom: 24px;"><img src="${logoUrl}" alt="${projectName}" style="max-height: 48px;"></div>` : `<h1 style="text-align:center; color:${primaryColor}; margin-bottom:24px;">${projectName}</h1>`}
        <h2 style="text-align:center; color:#111827;">Verify your account</h2>
        <p style="text-align:center; color:#6b7280;">
          Use the code below to verify your <strong>${projectName}</strong> account.
          This code expires in <strong>10 minutes</strong>.
        </p>
        <div style="margin:32px auto; padding:20px; text-align:center; background:#f9fafb; border-radius:12px; border:1px solid #e5e7eb;">
          <span style="font-size:32px; letter-spacing:6px; font-weight:700; color:${primaryColor};">${otp}</span>
        </div>
        <p style="text-align:center; font-size:14px; color:#9ca3af;">
          If you didn’t request this, you can safely ignore this email.
        </p>
        <hr style="margin-top:32px; border: 0; border-top: 1px solid #e5e7eb;" />
        <p style="text-align:center; font-size:12px; color:#9ca3af; margin-top: 20px;">
          © 2026 ${projectName} · ${footerText}
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("🔗 Preview URL:", preview);

    return info;
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
    throw error;
  }
};
