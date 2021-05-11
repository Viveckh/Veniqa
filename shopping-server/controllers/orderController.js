import orderService from '../services/orderService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger'

export default {
    async createCheckout(req, res, next) {
        let response;
        try {
            response = await orderService.createCheckout(req.body.addressId, req.body.shippingMethod, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in createCheckout Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async stripePaymentInstant(req, res, next){
        let response;
        //console.log(req.user);
        try {
            response = await orderService.stripePaymentInstant(req.body.checkoutId, req.user);
            console.log(response);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in stripePaymentInstant Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async completeCheckoutUsingStripePaymentInstant(req, res, next) {
        let response;
        try {
            response = await orderService.completeCheckoutUsingStripePaymentInstant(req.body.checkoutId, req.body.paymentToken, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in completeCheckoutUsingStripePaymentInstant Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },


    async completeCheckoutUsingCard(req, res, next) {
        let response;
        try {
            response = await orderService.completeCheckoutUsingCard(req.body.checkoutId, req.body.paymentToken, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in completeCheckoutUsingCard Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async completeCheckoutUsingKhalti(req, res, next) {
        let response;
        try {
            response = await orderService.completeCheckoutUsingKhalti(req.body.checkoutId, req.body.paymentToken, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in completeCheckoutUsingKhalti Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async isCheckoutValid(req, res, next) {
        let response;
        try {
            response = await orderService.isCheckoutValid(req.query.checkoutId, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in isCheckoutValid Controller", {meta: err});
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
            logger.error("Error in createPaymentToken Controller", {meta: err});
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
            logger.error("Error in completeCheckout Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}