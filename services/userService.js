import User from '../database/models/user';
import * as _ from 'lodash';

export default {
    async addNewAddress(userObj, addressObj) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            if (user) {
                if (!user.addresses) { user.addresses = []; }

                user.addresses.push({
                    firstName: addressObj.firstName,
                    lastName: addressObj.lastName,
                    addressLine1: addressObj.addressLine1,
                    addressLine2: addressObj.addressLine2,
                    city: addressObj.city,
                    state: addressObj.state,
                    zipCode: addressObj.zipCode,
                    country: addressObj.country,
                    mobilePhone: addressObj.mobilePhone
                });

                user = await user.save();
                if (user) {
                    result = {status: "successful", responseData: user.addresses};
                }
                else {
                    result = {status: "failed", errorDetails: "address could not be added"};
                }
            }
            else {
                result = {status: "failed", errorDetails: "user not found"};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async getAddresses(userObj) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            if (user) {
                result = {status: "successful", responseData: user.addresses};
            }
            else {
                result = {status: "failed", errorDetails: "user not found"};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateAddress(userObj, addressObj) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and proceed to update
            if (user) {
                // Validate that the address item matches by doing a match using the _ids
                let index = _.findIndex(user.addresses, (obj) => {
                    return obj._id.toString() == addressObj._id;
                });
                // Update the values if the address object is found, otherwise, return failure
                if (index > -1) {
                    user.addresses[index] = addressObj;
                }
                else {
                    result = {status: "failed", errorDetails: "address not found"};
                    return result;
                }

                // Save the update
                user = await user.save();
                if (user) {
                    // This means the address update was successful, so return all addresses
                    result = {status: "successful", responseData: user.addresses};
                }
                else {
                    // This means the address update was not successful, so return failed
                    result = {status: "failed", responseData: 'address update failed'};
                }
                return result;
            }
            else {
                result = {status: "failed", errorDetails: "user not found"};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteAddress(userObj, addressId) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // Make sure the user exists and delete the given address
            if (user) {
                // Remove the requested address from user
                user = await User.findOneAndUpdate({'addresses._id': addressId}, 
                    {$pull: { addresses: { _id: addressId}}},
                    {new: true}
                    ).exec()

                if (user) {
                    // This means the address update was successful, so return all addresses
                    result = {status: "successful", responseData: user.addresses};
                }
                else {
                    // This means the address update was not successful, so return failed
                    result = {status: "failed", responseData: 'address deletion failed'};
                }
                return result;
                
            }
            else {
                result = {status: "failed", errorDetails: "user not found"};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    }
}