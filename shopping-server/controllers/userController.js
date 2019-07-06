import userService from '../services/userService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async addNewAddress(req, res, next) {
        let response;
        try {
            response = await userService.addNewAddress(req.user, req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in addNewAddress Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getAddresses(req, res, next) {
        let response;
        try {
            response = await userService.getAddresses(req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getAddresses Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateAddress(req, res, next) {
        let response;
        try {
            response = await userService.updateAddress(req.user, req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in updateAddress Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async deleteAddress(req, res, next) {
        let response;
        try {
            response = await userService.deleteAddress(req.user, req.body.addressId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in deleteAddress Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getOrderList(req, res, next) {
        let response;
        try {
            response = await userService.getOrderList(req.user, req.body.pagingOptions, req.body.sortRule);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getOrderList Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getOrderDetails(req, res, next) {
        let response;
        try {
            response = await userService.getOrderDetails(req.user, req.query.orderId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getOrderDetails Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}
