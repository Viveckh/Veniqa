import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';
import emailService from './emailService';

export default {
    async createAdmin(userObj) {
        let user = new User({
            email: userObj.email,
            password: cryptoGen.createPasswordHash(await cryptoGen.generateRandomToken()),
            name: userObj.name,
            permissions: userObj.permissions,
            approved: true,
            passwordResetToken: await cryptoGen.generateRandomToken(),
            passwordResetExpires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
        });

        try {
            user = await user.save();
            if (user) {
                console.log("[DB]: User inserted => ", user);
                emailService.emailAdminWelcomeInstructions(user.email, user.name, user.passwordResetToken);
                return {email: user.email, name: user.name, permissions: user.permissions};
            }
            return {errMsg: 'could not create user'};
        }
        catch(err) {
            console.log("[ERROR]: User insertion failed => ", err)
            return err;
        }
    },

    async getAllAdmins() {
        try {
            let users = await User.find({}, '-_id email name permissions approved').exec();
            return users;
        }
        catch(err) {
            console.log("[ERROR]: Getting admins failed => ", err)
            return err;
        }
    },

    async getAdminDetails(email) {
        try {
            // find the admin
            let user = await User.findOne({email: email}, '-_id email name permissions approved').exec();

            if (user) {
                return user;
            }
            return "user not found";
        }
        catch(err){
            console.log(err);
            return false;
        }
    },

    async updateAdminAccess(userObj) {
        try {
            // Store the id and delete it from the received object, to prevent any accidental replacement of id field
            let email = userObj.email;
            if (!email) {
                return "Missing admin email";
            }
            delete userObj.email;

            // Make the update and return the updated document. Also run validators. Mongoose warns only limited validation takes place doing this in update
            let user = await User.findOneAndUpdate({email: email}, userObj, {
                runValidators: true, new: true,
                "fields": {'_id': 0, 'email': 1, 'name': 1, 'permissions': 1, 'approved': 1}
            }).exec();

            if (user) {
                return user;
            }
            return 'could not find admin';
        }
        catch(err) {
            console.log("[ERROR]: Admin access update failed => ", err)
            return err;
        }
    },

    async deleteAdmin(email) {
        try {
            // Remove the user
            let user = await User.remove({email: email}).exec();
            
            if (user) {
                return true;
            }
            return false;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}
