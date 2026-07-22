const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});


const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Your App" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            text,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Email send failed:", error);
    }
};

module.exports = sendEmail;
