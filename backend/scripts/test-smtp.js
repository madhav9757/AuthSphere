import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

console.log("Checking SMTP configuration...");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("User:", process.env.SMTP_USER);

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Verification Failed:");
        console.error(error);
    } else {
        console.log("✅ SMTP Server is ready to take our messages");

        // Attempt to send a test email
        const mailOptions = {
            from: `"AuthSphere Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to self
            subject: "Test Email from AuthSphere",
            text: "If you are reading this, your SMTP configuration is working correctly!",
            html: "<b>If you are reading this, your SMTP configuration is working correctly!</b>",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Error sending test email:", error);
            } else {
                console.log("✅ Test email sent successfully!");
                console.log("Message ID:", info.messageId);
            }
            process.exit(0);
        });
    }
});
