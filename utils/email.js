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

const welcomeNewUser = async (to, firstName, confirmationLink) => {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to,
    subject: "Welcome to Family Plan! Confirm Your Email",
    html: `
      <p>Hi ${firstName},</p>
      <p>Welcome to <strong>Family Plan</strong>! We’re thrilled to have you join our community, where planning and organizing for your family becomes effortless and fun.</p>
      <p>To get started, please confirm your email address by clicking the link below:</p>
      <a href="${confirmationLink}" style="display:inline-block; padding:10px 20px; color:#fff; background-color:#007BFF; text-decoration:none; border-radius:5px;">Confirm My Email</a>
      <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
      <p><a href="${confirmationLink}">${confirmationLink}</a></p>
      <p><strong>What’s next?</strong></p>
      <ul>
        <li>Explore all the features of Family Plan.</li>
        <li>Start organizing your family’s plans with ease.</li>
        <li>Enjoy tools tailored to simplify your day-to-day life.</li>
      </ul>
      <p>If you have any questions or need assistance, feel free to reply to this email or contact us at <a href="mailto:support@familyplan.com">support@familyplan.com</a>.</p>
      <p>Thanks for joining us! We're excited to help you make family planning easier than ever.</p>
      <p>Warm regards,</p>
      <p>The Family Plan Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email with confirmation link sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: `, error);
  }
}


module.exports = { sendWelcomeEmailCoParent, invite_referral_email , welcomeNewUser};
