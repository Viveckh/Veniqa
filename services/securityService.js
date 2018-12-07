import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';
import tokenValidityConfig from '../properties/tokenValidity';
import emailService from './emailService';

/**
 * This service performs security related tasks, like signup
 */
export default {
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
                console.log(user)
                if (user) {
                    emailService.emailPasswordResetInstructions(user.email, user.name, user.passwordResetToken);
                    return true;
                }
            }
            return false;
        }
        catch(err) {
            console.log(err)
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
            console.log(err);
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
                console.log(user)
                if (user) {
                    emailService.emailPasswordResetConfirmation(user.email, user.name);
                    return true;
                }
            }
            return false;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}