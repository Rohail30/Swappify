const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// const sendMail = (email, subject, data) => {
const sendMail = (type, data) => {

    let subject = '';
    let html = '';
    let to = '';

    switch (type) {
        case 'accountVerification':
            to = data.email;
            subject = 'Swappify - Account Verification';
            html = `
            <h2>Swappify - Account Verification</h2>
            <p>Click the link below to verify your account</p>
            <a href="${data.url}">Verify Account</a>
            `;
            break;

        case 'passwordReset':
            to = data.email;
            subject = 'Swappify - Password Reset';
            html = `
            <h2>Swappify - Password Reset</h2>
            <p>Your new password is <strong>${data.password}</strong></p>
            <p>Please change it after login</p>
            `;
            break;

        case 'adminAccountAction':
            to = data.email;
            subject = `Swappify - Account ${data.action}`;
            html = `
            <h2>Swappify - Account ${data.action}</h2>
            <p>Your account has been ${data.action} by the admin</p>
            `;
            break;

        case 'adminItemDelete':
            to = data.email;
            subject = 'Swappify - Item Deleted';
            html = `
            <h2>Swappify - Item Deleted</h2>
            <p>Your item <strong>${data.itemName}</strong> has been deleted by the admin</p>
            `;
            break;
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });

};


module.exports = sendMail;