import securityService from '../services/securityService';

export default {
    async signup(req, res, next) {
        let response;
        try {
            response = await securityService.signup(req.body);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: User signup failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}