import UserModel from '../database/models/user'

/**
 * This service performs security related tasks, like verifying user creds from db
 */
export default {
    async signup(userObj) {
        let user = new UserModel({
            email: userObj.email,
            password: userObj.password,
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

    },

    async login(loginObj) {
        
    }
}