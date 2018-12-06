import superAdminService from '../services/superAdminService';

export default {
    async createAdmin(req, res, next) {
        let response;
        try {
            response = await superAdminService.createAdmin(req.body);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Admin creation failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getAllAdmins(req, res, next) {
        let response;
        try {
            response = await superAdminService.getAllAdmins();
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting all admins failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getAdminDetails(req, res, next) {
        let response;
        try {
            response = await superAdminService.getAdminDetails(req.query.email);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting the admin failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async updateAdminAccess(req, res, next) {
        let response;
        try {
            response = await superAdminService.updateAdminAccess(req.body);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Updating the admin failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async deleteAdmin(req, res, next) {
        let response;
        try {
            response = await superAdminService.deleteAdmin(req.body.email);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Deleting the admin failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}