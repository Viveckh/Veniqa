import async from 'async';
import User from '../database/models/user';
import cryptoGen from '../authentication/cryptoGen';
import tokenValidityConfig from '../properties/tokenValidity';
import emailService from './emailService';

/**
 * This service performs security related tasks, like signup
 */
export default {
    async signup(userObj) {
        let user = new User({
            email: userObj.email,
            password: cryptoGen.createPasswordHash(userObj.password),
            name: userObj.name,
            emailConfirmationToken: await cryptoGen.generateRandomToken()
        });

        return  user.save()
                    .then(doc => {
                        console.log("[DB]: User inserted => ", doc)
                        emailService.emailEmailConfirmationInstructions(doc.email, doc.name, doc.emailConfirmationToken)
                        return {email: doc.email, name: doc.name};
                    })
                    .catch(err => {
                        console.log("[ERROR]: User insertion failed => ", err)
                        return err;
                    })
    },

    confirmEmailAddress(token) {
        let promise = new Promise((resolve, reject) => {
            User.findOne({emailConfirmationToken: token}, (err, user) => {
                if (err) { return resolve(false) }
                if (!user) {
                    //return {code: 404, errmsg: 'The token is invalid or already expired.'}
                    return resolve(false);
                }

                // if user is found, then go ahead and confirm the email
                user.emailConfirmationToken = undefined;

                user.save((err) => {
                    if (err) {
                        //return {code: 500, errmsg: 'Server could not reset password'}
                        return resolve(false)
                    }
                    return resolve(user)
                })
            })
        })
        .then(user => {
            if (user) {
                return true;
            }
            return false;
        })
        .catch(err => {
            console.log(err);
            return err;
        })

        return promise;
    },

    async forgotPassword(email) {
        let promise = new Promise((resolve, reject) => {
            let token = cryptoGen.generateRandomToken();
            resolve(token);
        }).then(token => {
            //if(1) throw "somedsf"
            return User.findOne({email: email}, (err, user) => {
                // Return if any errors exist
                if (err) {
                    return err;
                }
                // Return if user does not exist
                if (!user) {
                    return {code: 404, errmsg: 'User does not exist'};
                }
                // If user exists, then generate token and save it
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + tokenValidityConfig.passwordResetTokenValidFor;

                user.save((err) => {
                    if (err) {
                        return {code: 500, errmsg: 'Server could not generate token'}
                    }
                    console.log("inside callback", user);
                    return user;
                })
            })
        }).then(user => {
            console.log(user);
            if (user) {
                emailService.emailPasswordResetInstructions(user.email, user.name, user.passwordResetToken);
                return true;
            }
            return false;       
        })
        .catch(err => {
            console.log(err)
            return err;
        })

        return promise;
    },

    isPasswordResetTokenValid(token) {
        let promise = new Promise((resolve, reject) => {
            User.findOne({ passwordResetToken: token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
                if (err) {return resolve(false) }
                // If no matching users were found, it should definitely be expired/invalid token, because this would get called only if user received a reset link
                if (!user) {
                    return resolve(false);
                }
                return resolve(true);
            })
        })
        .catch(err => {
            console.log(err)
            return err;
        })

        return promise;
    },

    resetPassword(token, newPassword) {
        let promise = new Promise((resolve, reject) => {
            User.findOne({passwordResetToken: token, passwordResetExpires: { $gt: Date.now()}}, (err, user) => {
                if (err) { return resolve(false) }
                if (!user) {
                    //return {code: 404, errmsg: 'The token is invalid or already expired.'}
                    return resolve(false);
                }

                // if user is found, then go ahead and update the password
                user.password = cryptoGen.createPasswordHash(newPassword);
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;

                user.save((err) => {
                    if (err) {
                        //return {code: 500, errmsg: 'Server could not reset password'}
                        return resolve(false)
                    }
                    return resolve(user)
                })
            })
        })
        .then(user => {
            if (user) {
                emailService.emailPasswordResetConfirmation(user.email, user.name);
                return true;
            }
            return false;
        })
        .catch(err => {
            console.log(err);
            return err;
        })

        return promise;
    }


}