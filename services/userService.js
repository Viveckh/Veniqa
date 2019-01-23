import User from '../database/models/user';
import * as _ from 'lodash';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger'

export default {
    async addNewAddress(userObj, addressObj) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // If user is not authenticated or the user does not exist in system - stop
            // If so do not continue further
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }
            
            if (!user.addresses) { user.addresses = []; }

            // Save the address to the user record
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

            // Return the proper response
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: user.addresses} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            logger.error("Error in addNewAddress Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getAddresses(userObj) {
        let result = {};
        try {
            // find the user first and return found addresses, even if it is an empty list
            let user = await User.findOne({email: userObj.email}).exec();
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: user.addresses};
            return result;
        }
        catch(err) {
            logger.error("Error in getAddresses Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateAddress(userObj, addressObj) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // If user is not authenticated or the user does not exist in system - stop
            // If so do not continue further
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }
            
            // Validate that the address item matches by doing a match using the _ids
            let index = _.findIndex(user.addresses, (obj) => {
                return obj._id.toString() == addressObj._id;
            });

            // If the address is not found, return failure
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Otherwise, Update the address values
            user.addresses[index] = addressObj;
            user = await user.save();

            // Return the proper response depending on whether save was successful
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: user.addresses} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            logger.error("Error in updateAddress Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteAddress(userObj, addressId) {
        let result = {};
        try {
            // find the user first
            let user = await User.findOne({email: userObj.email}).exec();

            // If user is not authenticated or the user does not exist in system - stop
            // If so do not continue further
            if (!user) {
                result = {httpStatus: httpStatus.UNAUTHORIZED, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.UNAUTHORIZED)};
                return result;
            }

            // Remove the requested address from user
            user = await User.findOneAndUpdate({'addresses._id': addressId}, 
                {$pull: { addresses: { _id: addressId}}},
                {new: true}
                ).exec()

            // Return the proper response depending on whether save was successful
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: user.addresses} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            logger.error("Error in deleteAddress Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}