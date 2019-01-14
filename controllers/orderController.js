import orderService from '../services/orderService';
import httpStatus from 'http-status-codes';

export default {
    async createCheckout(req, res, next) {
        let response;
        try {
            response = await orderService.createCheckout(req.body.addressId, req.body.shippingMethod, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in createCheckout Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async createPaymentToken(req, res, next) {
        let response;
        try {
            response = await orderService.createPaymentToken(req.body.checkoutId, req.body.paymentSource, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in createPaymentToken Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async completeCheckout(req, res, next) {
        let response;
        try {
            response = await orderService.completeCheckout(req.body.paymentSource, req.body.paymentId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in completeCheckout Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}