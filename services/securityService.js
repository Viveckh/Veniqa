import bCrypt from 'bcrypt-nodejs';
import UserModel from '../database/models/user';

/**
 * This service performs security related tasks, like signup
 */
export default {
    async signup(userObj) {
        // Creating a hash by taking the password
        var createHash = function(password){
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        }

        let user = new UserModel({
            email: userObj.email,
            password: createHash(userObj.password),
            name: userObj.name 
        });

        return  user.save()
                    .then(doc => {
                        console.log("[DB]: User inserted => ", doc)
                        return {email: doc.email, name: doc.name};
                    })
                    .catch(err => {
                        console.log("[ERROR]: User insertion failed => ", err)
                        return err;
                    })

    }
}