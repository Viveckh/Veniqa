import shoppingService from "../services/shoppingService";
import httpStatus from 'http-status-codes';
import logger from '../logging/logger'

export default {
    async addToCart(req, res, next) {
        let response;
        try {
            response = await shoppingService.addToCart(req.user, req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in addToCart Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getCart(req, res, next) {
        let response;
        try {
            response = await shoppingService.getCart(req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getCart Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateCart(req, res, next) {
        let response;
        try {
            response = await shoppingService.updateCart(req.user, req.body.cartItems);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in updateCart Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async deleteFromCart(req, res, next) {
        let response;
        try {
            response = await shoppingService.deleteFromCart(req.user, req.body.cartItemIds);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in deleteFromCart Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

}