import orderService from '../services/orderService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async getOrderList(req, res, next) {
        let response;
        try {
            response = await orderService.getOrderList(req.body.orderStatus, req.body.pagingOptions, req.body.sortRule);
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
            response = await orderService.getOrderDetails(req.query.orderId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getOrderDetails Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async confirmOrder(req, res, next) {
        let response;
        try {
            response = await orderService.confirmOrder(req.body.orderId, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in confirmOrder Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async cancelOrder(req, res, next) {
        let response;
        try {
            response = await orderService.cancelOrder(req.body.orderId, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in cancelOrder Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async markItemAsFulfilling(req, res, next) {
        let response;
        try {
            response = await orderService.markItemAsFulfilling(req.body.orderId, req.body.cartItemId, req.body.store, req.body.orderNumber, req.body.totalCostPriceOfItemUSD, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in markItemAsFulfilling Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async markItemAsShipped(req, res, next) {
        let response;
        try {
            response = await orderService.markItemAsShipped(req.body.orderId, req.body.cartItemId, req.body.provider, req.body.trackingNumber, req.body.service, req.body.paidPostageInUSD, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in markItemAsShipped Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async markItemAsDelivered(req, res, next) {
        let response;
        try {
            response = await orderService.markItemAsDelivered(req.body.orderId, req.body.cartItemId, req.body.deliveryDate, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in markItemAsDelivered Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateOrderFulfillmentDetails(req, res, next) {
        let response;
        try {
            response = await orderService.updateOrderFulfillmentDetails(req.body.orderId, req.body.cartItemId, req.body.store, req.body.orderNumber, req.body.totalCostPriceOfItemUSD, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in updateOrderFulfillmentDetails Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateShipmentDetails(req, res, next) {
        let response;
        try {
            response = await orderService.updateShipmentDetails(req.body.orderId, req.body.cartItemId, req.body.provider, req.body.trackingNumber, req.body.service, req.body.paidPostageInUSD, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in updateShipmentDetails Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateDeliveryDetails(req, res, next) {
        let response;
        try {
            response = await orderService.updateDeliveryDetails(req.body.orderId, req.body.cartItemId, req.body.deliveryDate, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in updateDeliveryDetails Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async addComment(req, res, next) {
        let response;
        try {
            response = await orderService.addComment(req.body.orderId, req.body.comment, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in addComment Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async editComment(req, res, next) {
        let response;
        try {
            response = await orderService.editComment(req.body.orderId, req.body.commentId, req.body.comment, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in editComment Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async deleteComment(req, res, next) {
        let response;
        try {
            response = await orderService.deleteComment(req.body.orderId, req.body.commentId, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in deleteComment Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}