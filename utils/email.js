const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USERNAME, // Your Gmail address
    pass: process.env.MAIL_PASSWORD, // Your Gmail password or app-specific password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendWelcomeEmailCoParent = async (to, firstName, password) => {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to,
    subject: "Welcome to Our Service",
    text: `Hello ${firstName},\n\nWelcome to our service! We're glad to have you on board. Your login Credentials \nEmail: ${to} \nPassword:${password}  \n\nBest regards,\nYour Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: `, error);
  }
};

const invite_referral_email = async (to, referrerEmail) => {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to,
    subject: "Invitation to Join Our Service",
    text: `Hi,

Your friend ${referrerEmail} has invited you to join our service. Click the link below to subscribe and get a chance to win a free subscription for a year.

[Subscription Link]

Best regards,
Your Company Name`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: `, error);
  }
};

module.exports = { sendWelcomeEmailCoParent, invite_referral_email };
