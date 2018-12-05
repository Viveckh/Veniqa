import shoppingService from "../services/shoppingService";

export default {
    async addToCart(req, res, next) {
        let response;
        try {
            response = await shoppingService.addToCart(req.user, req.body);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Add to cart failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}