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