import config from 'config';
import logger from '../logging/logger.js';

// Import both implementations
import nodemailerService from './emailServiceNodemailer.js';
import sendgridService from './emailServiceSendgrid.js';

// Select which service to use based on environment variable
const serviceChoice = process.env.EMAIL_SERVICE || 'sendgrid'; 
let emailService = sendgridService;

// If EMAIL_SERVICE=nodemailer → switch
if (serviceChoice.toLowerCase() === 'nodemailer') {
    logger.info('Using Nodemailer for email service (local/dev mode).');
    emailService = nodemailerService;
} else {
    logger.info('Using SendGrid for email service (production mode).');
}

// Export the selected email service
export default emailService;
