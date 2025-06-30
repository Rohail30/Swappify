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

        case 'receiveTradeOffer':
            to = data.email;
            subject = 'Swappify - Trade Offer Received';
            html = `
            <h2>Swappify - Trade Offer Received</h2>
            <p>You have received a trade offer for your item <strong>${data.itemName}</strong></p>
            <p>Please check your trade section for more details</p>
            `;
            break;

        case 'tradeOfferAccepted':
            to = data.email;
            subject = 'Swappify - Trade Offer Accepted';
            html = `
            <h2>Swappify - Trade Offer Accepted</h2>
            <p>Your trade offer for the item <strong>${data.itemName}</strong> has been accepted</p>
            <p>Please check your trade section for more details</p>
            `;
            break;

        case 'counterTradeOffer':
            to = data.email;
            subject = 'Swappify - Counter Trade Offer';
            html = `
            <h2>Swappify - Counter Trade Offer</h2>
            <p>You have received a counter trade offer for your item <strong>${data.itemName}</strong></p>
            <p>Please check your trade section for more details</p>
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