import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';
import config from 'config';
import emailService from './emailServiceSendgrid';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

/**
 * This service performs security related tasks, like signup
 */
export default {
    async forgotPassword(email) {
        let result = {};
        try {
            let user = await User.findOne({email: email}).exec();
            let token = await cryptoGen.generateRandomToken();
            
            // If an associated user with the email wasn't found, and a token not generated, stop here
            if (!(user && token)) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Generate password reset token and save it
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + config.get('token_validity.password_reset_token_valid_for');
            user = await user.save();

            // If the user was not properly saved, stop here and return failure
            if (!user) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }

            // If we have gotten this far, return success
            emailService.emailPasswordResetInstructions(user.email, user.name, user.passwordResetToken);
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: true};
            return result;
            
        }
        catch(err) {
            logger.error("Error in forgotPassword Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async isPasswordResetTokenValid(token) {
        let result = {};
        try {
            let user = await User.findOne({ passwordResetToken: token, passwordResetExpires: {$gt: Date.now()}}).exec();
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: true} : {httpStatus: httpStatus.OK, status: "successful", responseData: false};
            return result;
        }
        catch(err) {
            logger.error("Error in isPasswordResetTokenValid Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async resetPassword(token, newPassword) {
        let result = {};
        try {
            let user = await User.findOne({passwordResetToken: token, passwordResetExpires: { $gt: Date.now()}});

            // If an associated user with the given token is found and token hasn't expired yet, only then let's continue
            if (!user) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }
            
            user.password = cryptoGen.createPasswordHash(newPassword);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            // Overwrite the user variable with result from the new save.
            user = await user.save();
            // If the user was not properly saved, stop here and return failure
            if (!user) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }
           
            // If we have gotten this far, return success
            emailService.emailPasswordResetConfirmation(user.email, user.name);
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: true};
            return result;
        }
        catch(err) {
            logger.error("Error in resetPassword Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}