import nodemailer from 'nodemailer';
import emailConfig from '../properties/email';
import frontEndUrls from '../properties/frontEndUrls';
let transporter = nodemailer.createTransport(emailConfig.credentials)

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
         console.log(error);
    } else {
         console.log('Email Service is up and ready to go');
    }
});

export default {
    emailEmailConfirmationInstructions(email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Smart Bot 👾" <smartbot@ngineerx.com>', // sender address
            to: 'smartbot@ngineerx.com, ' + email, // list of receivers
            subject: 'Veniqa - Confirm Your Email', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to confirm your email address<br><br><a href="' + frontEndUrls.emailConfirmationBaseUrl + '/' + token + '"></a>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    },

    emailPasswordResetInstructions(email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Smart Bot 👾" <smartbot@ngineerx.com>', // sender address
            to: 'smartbot@ngineerx.com, ' + email, // list of receivers
            subject: 'Veniqa - Password Reset', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to reset your password<br><br><a href="' + frontEndUrls.passwordResetBaseUrl + '/' + token + '"></a>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    },

    emailPasswordResetConfirmation(email, name) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Smart Bot 👾" <smartbot@ngineerx.com>', // sender address
            to: 'smartbot@ngineerx.com, ' + email, // list of receivers
            subject: 'Veniqa - Password Reset Successful', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Your password has been successfully reset.<br><br>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
}