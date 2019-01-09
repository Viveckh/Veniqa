import orderService from '../services/orderService';

export default {
    async getOrderList(req, res, next) {
        let response;
        try {
            response = await orderService.getOrderList(req.body.orderStatus, req.body.pagingOptions);
            if (response.errorDetails) {
                return res.status(400).send(response);
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting orders failed => ", err);
            return res.status(500).send({status: "failed", errorDetails: err});
        }
    },

    async getOrderDetails(req, res, next) {
        let response;
        try {
            response = await orderService.getOrderDetails(req.query.orderId);
            if (response.errorDetails) {
                return res.status(400).send(response);
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting order details failed => ", err);
            return res.status(500).send({status: "failed", errorDetails: err});
        }
    },

    async updateOrderDetails(req, res, next) {
        let response;
        try {
            response = await orderService.updateOrder();
            if (response.errorDetails) {
                return res.status(400).send(response);
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Updating order details failed => ", err);
            return res.status(500).send({status: "failed", errorDetails: err});
        }
    }
}