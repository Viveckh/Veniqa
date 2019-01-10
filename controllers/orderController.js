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
    },

    async updateOrderDetails(req, res, next) {
        let response;
        try {
            response = await orderService.updateOrder();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in updateOrderDetails Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },
}