import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';
import emailService from './emailServiceSendgrid';
import httpStatus from  'http-status-codes';
import logger from '../logging/logger';

export default {
    async createAdmin(userObj) {
        let result = {};
        try {
            let user = new User({
                email: userObj.email,
                password: cryptoGen.createPasswordHash(await cryptoGen.generateRandomToken()),
                name: userObj.name,
                permissions: userObj.permissions,
                approved: true,
                passwordResetToken: await cryptoGen.generateRandomToken(),
                passwordResetExpires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
            });

            user = await user.save();
            if (!user) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
                return result;
            }

            // If we have gotten here, the request must be successful, so respond accordingly
            logger.info("A new user has been added", {meta: user});
            emailService.emailAdminWelcomeInstructions(user.email, user.name, user.passwordResetToken);
            let responseObj = {email: user.email, name: user.name, permissions: user.permissions};
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: responseObj}
            return result;
        }
        catch(err) {
            logger.error("Error in createAdmin Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getAllAdmins() {
        let result = {};
        try {
            let users = await User.find({}, '-_id email name permissions approved').exec();
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: users};
            return result;
        }
        catch(err) {
            logger.error("Error in getAllAdmins Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getAdminDetails(email) {
        let result = {};
        try {
            // find the admin
            let user = await User.findOne({email: email}, '-_id email name permissions approved').exec();
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: user} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err){
            logger.error("Error in getAdminDetails Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateAdminAccess(userObj) {
        let result = {};
        try {
            // Store the id and delete it from the received object, to prevent any accidental replacement of id field
            let email = userObj.email;
            if (!email) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Missing Admin email"};
                return result;
            }
            delete userObj.email;

            // Make the update and return the updated document. Also run validators. Mongoose warns only limited validation takes place doing this in update
            let user = await User.findOneAndUpdate({email: email}, userObj, {
                runValidators: true, new: true,
                "fields": {'_id': 0, 'email': 1, 'name': 1, 'permissions': 1, 'approved': 1}
            }).exec();

            // Return the result
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: user} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            logger.error("Error in updateAdminAccess Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteAdmin(email) {
        let result = {};
        try {
            // Remove the user
            let user = await User.remove({email: email}).exec();
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: user} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in deleteAdmin Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}
