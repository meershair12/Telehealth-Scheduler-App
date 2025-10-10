const nodemailer = require("nodemailer");


const companyEmails ={
    support:"it@personichealth.com"
}
// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
    host: "0.0.0.0", // e.g. smtp.gmail.com or smtp.office365.com
    port: 465, // 465 for SSL, 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
        user: "", // your email
        pass: "", // app-specific password
    },
    tls: {
    rejectUnauthorized: false, // <-- allow self-signed certificate
  },
});

// Test the SMTP connection
transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to take messages 🚀");
    }
});






// module.exports = { transporter, companyEmails }

// Usage example:
// await sendOTPEmail('user@example.com', '123456', 'Ahmed Ali');