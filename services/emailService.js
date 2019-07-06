import nodemailer from 'nodemailer';
import config from 'config';
import logger from '../logging/logger'

// Set up the connection object
let emailConfig = {
    credentials: {
        host: process.env.VENIQA_NODEMAILER_HOST,
        port: process.env.VENIQA_NODEMAILER_PORT,
        secure: process.env.VENIQA_NODEMAILER_SECURE,
        auth: {
            user: process.env.VENIQA_NODEMAILER_USER,
            pass: process.env.VENIQA_NODEMAILER_PASSWORD
        },
        tls: {
            rejectUnauthorized: process.env.VENIQA_NODEMAILER_REJECT_UNAUTHORIZED
        }
    }
}

let transporter = nodemailer.createTransport(emailConfig.credentials)

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
         logger.error("Error while connecting to email service", {meta: error});
    } else {
         logger.info('Email Service is up and ready to go');
    }
});

export default {
    emailEmailConfirmationInstructions(email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Support" <support@veniqa.com>', // sender address
            to: 'support@veniqa.com, ' + email, // list of receivers
            subject: 'Veniqa - Confirm Your Email', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to confirm your email address<br><br><button><a href="' + config.get('frontend_urls.email_confirmation_base_url') + '/' + token + '">Confirm Your Email Address</a></button>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return logger.error("Error while sending email", {meta: error});
            }
            logger.verbose('Email sent', {meta: info});
        });
    },

    emailPasswordResetInstructions(email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Support" <support@veniqa.com>', // sender address
            to: 'support@veniqa.com, ' + email, // list of receivers
            subject: 'Veniqa - Password Reset', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to reset your password<br><br><button><a href="' + config.get('frontend_urls.password_reset_base_url') + '/' + token + '">Reset Password</a></button>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return logger.error("Error while sending email", {meta: error});
            }
            logger.verbose('Email sent', {meta: info});
        });
    },

    emailPasswordResetConfirmation(email, name) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Support" <support@veniqa.com>', // sender address
            to: 'support@veniqa.com, ' + email, // list of receivers
            subject: 'Veniqa - Password Reset Successful', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Your password has been successfully reset.<br><br>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return logger.error("Error while sending email", {meta: error});
            }
            logger.verbose('Email sent', {meta: info});
        });
    }
}