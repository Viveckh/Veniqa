import orderService from '../services/orderService';

export default {
    async initiateCheckout(req, res, next) {
        let response;
        try {
            response = await orderService.initiateCheckout(req.user, req.body.cart, req.body.addressId, req.body.paymentSource);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Checkout failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async completeCheckout(req, res, next) {
        let response;
        try {
            response = await orderService.completeCheckout(req.user, req.body.paymentId);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Checkout completion failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}