import superAdminService from '../services/superAdminService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async createAdmin(req, res, next) {
        let response;
        try {
            response = await superAdminService.createAdmin(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in createAdmin Controller", {meta: err});
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
            logger.error("Error in getAllAdmins Controller", {meta: err});
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
            logger.error("Error in getAdminDetails Controller", {meta: err});
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
            logger.error("Error in updateAdminAccess Controller", {meta: err});
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
            logger.error("Error in deleteAdmin Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}