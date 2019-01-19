import securityService from '../services/securityService';
import logger from '../logging/logger';

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
            logger.error("Error in signup Controller", {meta: err});
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
            logger.error("Error in resendEmailAddressConfirmationLink Controller", {meta: err});
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
            logger.error("Error in confirmEmailAddress Controller", {meta: err});
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
            logger.error("Error in forgotPassword Controller", {meta: err});
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
            logger.error("Error in validatePasswordResetToken Controller", {meta: err});
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
            logger.error("Error in resetPassword Controller", {meta: err});
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    }
}