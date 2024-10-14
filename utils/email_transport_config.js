const nodemailer = require("nodemailer");
require("dotenv").config();

const { MAIL_HOST, MAIL_PORT, MAIL_MAILER ,MAIL_USERNAME,MAIL_PASSWORD} = process.env


const transportEmail =

    nodemailer.createTransport({

        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: true,
        service: MAIL_MAILER,
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD
        }
        
    });



async function send_OTP_email(email, OTP) {


    await transportEmail.sendMail({
        from: "ibrar011@gmail.com 📧 Dylan",
        to: email,
        subject: "Email Verification OTP",
        html: `<div><h3>Welcome to Dylan</h3>
        <p>Please use the following code to verify your email:</p>
        <h1 style="letter-spacing:12px"><b>${OTP}</b></h1></div>`,

    });


}
async function send_partner_email(email, password) {


    await transportEmail.sendMail({
        from: "ibrar011@gmail.com 📧 Dylan",
        to: email,
        subject: "PARTNER INVITATION",
        html: `<div><h3>Welcome to Seller partner dashboard.</h3>
        <p>Please use these credentials for Partner dashboard login.</p>
        <h5><b>Email: ${email}</b></h5></div,
        <h5><b>PAssword:  ${password}</b></h5></div>`,

    });


}

async function reset_password_email(email, OTP) {



    await transportEmail.sendMail({
        from: "ibrar011@gmail.com 📧 Dylan",
        to: email,
        subject: "Reset Password",
        html: `<div>
        <p>Enter the following OTP to reset your password</p>
        <h1 style="letter-spacing:12px"><b>${OTP}</b></h1></div>`,

    });


}

async function register_user_email(email) {



    await transportEmail.sendMail({
        from: "martingarix7878@gmail.com",
        to: email,
        subject: "Registration Successfull | Family Plan",
        html: `<div>
        <p>You Have Registered to our Portal , Thankyou for Joining</p>
       </div>`,

    });


}

module.exports = { send_OTP_email, reset_password_email, send_partner_email , register_user_email}