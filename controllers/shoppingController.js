import shoppingService from "../services/shoppingService";
import httpStatus from 'http-status-codes';

export default {
    async addToCart(req, res, next) {
        let response;
        try {
            response = await shoppingService.addToCart(req.user, req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in addToCart Controller ->", err);
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
            console.log("Error in getCart Controller ->", err);
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
            console.log("Error in updateCart Controller ->", err);
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
            console.log("Error in deleteFromCart Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

}