import superAdminService from '../services/superAdminService';
import httpStatus from 'http-status-codes';

export default {
    async createAdmin(req, res, next) {
        let response;
        try {
            response = await superAdminService.createAdmin(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in createAdmin Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getAllAdmins(req, res, next) {
        let response;
        try {
            response = await superAdminService.getAllAdmins();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getAllAdmins Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getAdminDetails(req, res, next) {
        let response;
        try {
            response = await superAdminService.getAdminDetails(req.query.email);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getAdminDetails Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateAdminAccess(req, res, next) {
        let response;
        try {
            response = await superAdminService.updateAdminAccess(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in updateAdminAccess Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async deleteAdmin(req, res, next) {
        let response;
        try {
            response = await superAdminService.deleteAdmin(req.body.email);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in deleteAdmin Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}