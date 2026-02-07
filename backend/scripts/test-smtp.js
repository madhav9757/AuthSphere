import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- Mock Data ---
const projectName = "AuthSphere Hub";
const subjectLine = `Verify your identity – ${projectName}`;
const otp = "892 043";

const logoUrl = "https://cdn-icons-png.flaticon.com/512/2913/2913564.png";
const primaryColor = "#2563eb";

const ip = "192.168.1.10";
const device = "Chrome 120.0 on Windows 11";
const location = "San Francisco, CA, US";
const timestamp = new Date().toUTCString();

const requestId = "req_" + Math.random().toString(36).substring(2, 10);
const projectId = "proj_6974743656f9c5...203";

const supportUrl = "https://authsphere.dev/support";
const privacyUrl = "https://authsphere.dev/privacy";
const securityUrl = "https://authsphere.dev/security";

const companyAddress = "123 Security Blvd, Suite 100, San Francisco, CA, USA";

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${subjectLine}</title>

<style>

/* ----------------------------------------------------
   Base Reset & Typography
---------------------------------------------------- */

body {
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
                 Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
}

img {
    max-width: 100%;
    display: block;
}

a {
    color: ${primaryColor};
    text-decoration: none;
}

/* ----------------------------------------------------
   Wrapper & Container
---------------------------------------------------- */

.wrapper {
    width: 100%;
    padding: 48px 0;
    background-color: #f8fafc;
}

.container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.04);
}

/* ----------------------------------------------------
   Header
---------------------------------------------------- */

.header {
    padding: 48px 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f5f9;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.logo {
    height: 40px;
}

.project-name {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
}

.security-badge {
    background-color: #ecfdf5;
    color: #059669;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

/* ----------------------------------------------------
   Main Content
---------------------------------------------------- */

.main {
    padding: 64px 80px;
}

.h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 16px;
    color: #0f172a;
}

.text {
    font-size: 18px;
    color: #64748b;
    line-height: 1.65;
    margin: 0;
}

/* ----------------------------------------------------
   OTP Section
---------------------------------------------------- */

.otp-section {
    margin: 56px 0;
    padding: 48px;
    display: flex;
    align-items: center;
    gap: 48px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
}

.otp-box {
    flex: 1;
}

.otp {
    font-family: "JetBrains Mono", monospace;
    font-size: 56px;
    font-weight: 800;
    letter-spacing: 6px;
    color: ${primaryColor};
}

.otp-label {
    margin-top: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #94a3b8;
    text-transform: uppercase;
}

.otp-info {
    max-width: 300px;
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
}

/* ----------------------------------------------------
   Informational Sections
---------------------------------------------------- */

.section {
    margin-top: 48px;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
}

.section-text {
    font-size: 14px;
    color: #475569;
    line-height: 1.65;
}

/* ----------------------------------------------------
   Request Details Grid
---------------------------------------------------- */

.info-grid {
    margin-top: 48px;
    padding-top: 48px;
    border-top: 1px solid #f1f5f9;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
}

.info-card {
    background-color: #ffffff;
}

.info-list {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #64748b;
}

.info-list li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.info-list span {
    color: #1e293b;
    font-weight: 500;
}

/* ----------------------------------------------------
   Security Notice
---------------------------------------------------- */

.security-box {
    margin-top: 48px;
    padding: 32px 40px;
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 16px;
}

.security-title {
    font-size: 15px;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 12px;
}

.security-item {
    font-size: 14px;
    color: #b45309;
    margin-bottom: 8px;
}

/* ----------------------------------------------------
   Footer
---------------------------------------------------- */

.footer {
    padding: 48px 80px;
    background-color: #f9fafb;
    border-top: 1px solid #f1f5f9;
    text-align: center;
}

.footer-links {
    margin-bottom: 16px;
}

.footer-links a {
    margin: 0 12px;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
}

.legal-text {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.6;
    margin-top: 12px;
}

/* ----------------------------------------------------
   Responsive
---------------------------------------------------- */

@media (max-width: 900px) {
    .container {
        border-radius: 0;
    }

    .header,
    .main,
    .footer {
        padding: 32px;
    }

    .otp-section {
        flex-direction: column;
        text-align: center;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .otp {
        font-size: 42px;
    }
}

</style>
</head>

<body>

<div class="wrapper">
<div class="container">

<!-- Header -->
<div class="header">
    <div class="header-left">
        ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="${projectName}" />` : ``}
        <span class="project-name">${projectName}</span>
    </div>
    <div class="security-badge">Secure Authentication</div>
</div>

<!-- Main -->
<div class="main">

<h1 class="h1">Verify your identity</h1>

<p class="text">
We received a request to access your <strong>${projectName}</strong> account.
To continue, please confirm your identity using the verification code below.
</p>

<p class="text" style="margin-top:12px;">
This additional verification step helps protect your account from unauthorized access.
</p>

<!-- OTP -->
<div class="otp-section">
    <div class="otp-box">
        <div class="otp">${otp}</div>
        <div class="otp-label">One-time verification code</div>
    </div>
    <div class="otp-info">
        Use this code to complete your sign-in.  
        This code will automatically expire in 10 minutes.
    </div>
</div>

<!-- Why -->
<div class="section">
    <div class="section-title">Why you’re receiving this email</div>
    <p class="section-text">
        A sign-in or sensitive action was initiated on your account.
        To ensure security, verification is required before completing this request.
    </p>
</div>

<!-- What Next -->
<div class="section">
    <div class="section-title">What happens next</div>
    <ul class="section-text">
        <li>Enter the verification code on the sign-in screen.</li>
        <li>Once verified, access will be granted immediately.</li>
        <li>If the code expires, you may request a new one.</li>
    </ul>
</div>

<!-- Request Details -->
<div class="info-grid">

<div class="info-card">
    <div class="section-title">Request Context</div>
    <ul class="info-list">
        <li>IP Address <span>${ip}</span></li>
        <li>Location <span>${location}</span></li>
    </ul>
</div>

<div class="info-card">
    <div class="section-title">Device Information</div>
    <ul class="info-list">
        <li>Browser <span>${device}</span></li>
        <li>Time <span>${timestamp}</span></li>
    </ul>
</div>

<div class="info-card">
    <div class="section-title">Security Reference</div>
    <ul class="info-list">
        <li>Request ID <span>${requestId}</span></li>
        <li>Project ID <span>${projectId}</span></li>
    </ul>
</div>

</div>

<!-- Security Notice -->
<div class="security-box">
    <div class="security-title">Security Notice</div>
    <div class="security-item">• This code is confidential and intended only for you.</div>
    <div class="security-item">• ${projectName} staff will never ask for this code.</div>
    <div class="security-item">• Only enter this code on official ${projectName} services.</div>
    <div class="security-item">• If you did not request this action, please secure your account.</div>
</div>

</div>

<!-- Footer -->
<div class="footer">

<div class="footer-links">
    <a href="${supportUrl}">Support</a>
    <a href="${privacyUrl}">Privacy</a>
    <a href="${securityUrl}">Security</a>
</div>

<p class="legal-text">
© ${new Date().getFullYear()} ${projectName}. All rights reserved.<br />
${companyAddress}
</p>

<p class="legal-text">
This email was sent by ${projectName} on behalf of an application using our authentication platform.
If you did not initiate this request, no further action is required.
</p>

</div>

</div>
</div>

</body>
</html>
`;

console.log("Sending 'Final Developer' Test Email...");

transporter.sendMail(
  {
    from: `"AuthSphere Security" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    subject: `[${projectName}] Verify logic access: ${otp}`,
    html: htmlTemplate,
  },
  (error, info) => {
    if (error) {
      console.error("❌ Failed:", error);
    } else {
      console.log("✅ Sent!", info.messageId);
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log("🔗 Preview:", preview);
    }
    process.exit(0);
  },
);
