import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';
import tokenValidityConfig from '../properties/tokenValidity';
import emailService from './emailServiceSendgrid';
import logger from '../logging/logger';

/**
 * This service performs security related tasks, like signup
 */
export default {
    async signup(userObj) {
        let user = new User({
            email: userObj.email,
            password: cryptoGen.createPasswordHash(userObj.password),
            name: userObj.name,
            emailConfirmationToken: await cryptoGen.generateRandomToken(),
            referral_token: await cryptoGen.generateFriendlyToken(4)
        });

        try {
            user = await user.save();
            if (user) {
                logger.info("User inserted", {meta: user});
                emailService.emailEmailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken)
                return {email: user.email, name: user.name};
            }
            return {errMsg: 'could not create user'};
        }
        catch(err) {
            logger.error("Error in signup Service", {meta: err});
            return err;
        }
    },

    async resendEmailAddressConfirmationLink(email) {
        try {
            // This should only work if there is already an existing emailConfirmationToken. If there is none, it means user already verified
            let user = await User.findOne({email: email}).exists('emailConfirmationToken').exec();
            let token = await cryptoGen.generateRandomToken();
    
            // If a user is found, and they are still unverified, update the token and send the email
            if (user && token) {
                user.emailConfirmationToken = token;

                // Overwrite the user variable with result from the new save.
                user = await user.save();
                if (user) {
                    emailService.emailEmailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken)
                    return true;
                }
            }
            return {errMsg: 'Email is already confirmed or does not exist in system.'};
        }
        catch(err) {
            logger.error("Error in resendEmailAddressConfirmationLink Service", {meta: err})
            return false;
        }
    },

    async confirmEmailAddress(token) {
        try {
            let user = await User.findOne({emailConfirmationToken: token}).exec();

            // If the user is found, let's continue
            if (user) {
                user.emailConfirmationToken = undefined;

                // Overwrite the user variable with result from the new save.
                user = await user.save();
                if (user) {
                    return true;
                }
            }
            return false;
        }
        catch(err) {
            logger.error("Error in confirmEmailAddress Service", {meta: err})
            return false;
        }
    },

    async forgotPassword(email) {
        try {
            let user = await User.findOne({email: email}).exec();
            let token = await cryptoGen.generateRandomToken();
            
            // If an associated user with the email was found, and a token generated, let's continue
            if (user && token) {
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + tokenValidityConfig.passwordResetTokenValidFor;

                // Overwrite the user variable with result from the new save.
                user = await user.save();
                if (user) {
                    emailService.emailPasswordResetInstructions(user.email, user.name, user.passwordResetToken);
                    return true;
                }
            }
            return false;
        }
        catch(err) {
            logger.error("Error in forgotPassword Service", {meta: err});
            return false;
        }
    },

    async isPasswordResetTokenValid(token) {
        try {
            let user = await User.findOne({ passwordResetToken: token, passwordResetExpires: {$gt: Date.now()}}).exec();
            if (user) {
                return true;
            }
            return false;
        }
        catch(err) {
            logger.error("Error in isPasswordResetTokenValid Service", {meta: err});
            return false;
        }
    },

    async resetPassword(token, newPassword) {
        try {
            let user = await User.findOne({passwordResetToken: token, passwordResetExpires: { $gt: Date.now()}});

            // If an associated user with the token is found and it hasn't expired yet, let's continue
            if (user) {
                user.password = cryptoGen.createPasswordHash(newPassword);
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;

                // Overwrite the user variable with result from the new save.
                user = await user.save();
                if (user) {
                    emailService.emailPasswordResetConfirmation(user.email, user.name);
                    return true;
                }
            }
            return false;
        }
        catch(err) {
            logger.error("Error in resetPassword Service", {meta: err});
            return false;
        }
    }
}