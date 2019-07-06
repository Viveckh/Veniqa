import sendgridMail from '@sendgrid/mail';
import config from 'config';
import logger from '../logging/logger';

sendgridMail.setApiKey(process.env.VENIQA_SENDGRID_API_KEY);

export default {
    emailAdminWelcomeInstructions(email, name, token) {
        // setup email data
        let mailOptions = {
            from: '"Veniqa Support" <support@veniqa.com>', // sender address
            to: email, // list of receivers
            subject: 'Veniqa - Admin Onboarding Instructions', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Thanks for joining Veniqa as an admin. <br> Before you can login, please click the link below to reset your login password<br><br><button><a href="' + config.get('frontend_urls.password_reset_base_url') + '/' + token + '">Reset Password</a></button><br><br>Once you reset your password, you will be redirected to the login page.',
            templateId: config.get('sendgrid.templates.confirm_account_admin'),
            dynamic_template_data: {
                name: name,
                confirm_account_admin_url: config.get('frontend_urls.password_reset_base_url') + '/' + token
            }
        };

        this.triggerEmail(mailOptions);
    },

    emailPasswordResetInstructions(email, name, token) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Support" <support@veniqa.com>', // sender address
            to: email, // list of receivers
            subject: 'Veniqa - Password Reset', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Please click the link below to reset your password<br><br><button><a href="' + config.get('frontend_urls.password_reset_base_url') + '/' + token + '">Reset Password</a></button>',
            templateId: config.get('sendgrid.templates.reset_password_admin'),
            dynamic_template_data: {
                name: name,
                reset_password_admin_url: config.get('frontend_urls.password_reset_base_url') + '/' + token
            }
        };

        this.triggerEmail(mailOptions);
    },

    emailPasswordResetConfirmation(email, name) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Veniqa Support" <support@veniqa.com>', // sender address
            to: email, // list of receivers
            subject: 'Veniqa - Password Reset Successful', // Subject line
            html: '<b>Hi </b>' +  name + '<br>Your password has been successfully reset.<br><br>',
            templateId: config.get('sendgrid.templates.confirmation_password_reset_admin'),
            dynamic_template_data: {
                name: name
            }
        };

        this.triggerEmail(mailOptions);
    },

    triggerEmail(mailOptions) {
        sendgridMail.send(mailOptions, (error, result) => {
            if (error) {
                return logger.error("Error while sending email", {meta: error});
            }
            logger.verbose('Email sent', {meta: result});
        });
    }
}