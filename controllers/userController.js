import userService from '../services/userService';

export default {
    async addNewAddress(req, res, next) {
        let response;
        try {
            response = await userService.addNewAddress(req.user, req.body);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Adding new address failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getAddresses(req, res, next) {
        let response;
        try {
            response = await userService.getAddresses(req.user);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting user addresses failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async updateAddress(req, res, next) {
        let response;
        try {
            response = await userService.updateAddress(req.user, req.body);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Updating user address failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async deleteAddress(req, res, next) {
        let response;
        try {
            response = await userService.deleteAddress(req.user, req.body.addressId);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Deleting user address failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}
