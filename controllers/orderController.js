import orderService from '../services/orderService';
import httpStatus from 'http-status-codes';

export default {
    async getOrderList(req, res, next) {
        let response;
        try {
            response = await orderService.getOrderList(req.body.orderStatus, req.body.pagingOptions);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getOrderList Controller ->", err);
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
            console.log("Error in getOrderDetails Controller ->", err);
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
            console.log("Error in confirmOrder Controller ->", err);
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
            console.log("Error in cancelOrder Controller ->", err);
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
            console.log("Error in markItemAsFulfilling Controller ->", err);
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
            console.log("Error in markItemAsShipped Controller ->", err);
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
            console.log("Error in markItemAsDelivered Controller ->", err);
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
            console.log("Error in updateOrderFulfillmentDetails Controller ->", err);
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
            console.log("Error in updateShipmentDetails Controller ->", err);
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
            console.log("Error in updateDeliveryDetails Controller ->", err);
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
            console.log("Error in addComment Controller ->", err);
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
            console.log("Error in editComment Controller ->", err);
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
            console.log("Error in deleteComment Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}