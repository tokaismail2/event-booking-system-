const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  
    try {
        // Create reusable transporter object using SMTP
       const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME, // ايميل جوجل الحقيقي
    pass: process.env.EMAIL_PASSWORD, // كلمة مرور التطبيق من App Passwords
  },
   tls: {
    rejectUnauthorized: false,  // تجاهل مشكلة الشهادة الموقعة ذاتياً
  },
        });

        // Email options
        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: options.to,
            subject: options.subject,
            text: options.message,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${options.to}`);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw new Error("Email sending failed");
    }
};



module.exports = { sendEmail };
