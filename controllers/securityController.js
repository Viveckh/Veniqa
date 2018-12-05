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
    },

    /** The reason this is resend is because one copy gets sent upon sign up automatically */
    async resendEmailAddressConfirmationLink(req, res, next) {
        let response;
        try {
            response = await securityService.resendEmailAddressConfirmationLink(req.query.email);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Sending email confirmation link failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async confirmEmailAddress(req, res, next) {
        let response;
        try {
            response = await securityService.confirmEmailAddress(req.params.token);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Confirming email address failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async forgotPassword(req, res, next) {
        let response;
        try {
            response = await securityService.forgotPassword(req.query.email);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Forgot password action failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async validatePasswordResetToken(req, res, next) {
        let response;
        try {
            response = await securityService.isPasswordResetTokenValid(req.params.token);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Password reset token validation failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async resetPassword(req, res, next) {
        let response;
        try {
            response = await securityService.resetPassword(req.body.token, req.body.newPassword);
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Password reset failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}