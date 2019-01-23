import securityService from '../services/securityService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async signup(req, res, next) {
        let response;
        try {
            response = await securityService.signup(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in signup Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    /** The reason this is resend is because one copy gets sent upon sign up automatically */
    async resendEmailAddressConfirmationLink(req, res, next) {
        let response;
        try {
            response = await securityService.resendEmailAddressConfirmationLink(req.query.email);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in resendEmailAddressConfirmationLink Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async confirmEmailAddress(req, res, next) {
        let response;
        try {
            response = await securityService.confirmEmailAddress(req.params.token);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in confirmEmailAddress Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async forgotPassword(req, res, next) {
        let response;
        try {
            response = await securityService.forgotPassword(req.query.email);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in forgotPassword Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async validatePasswordResetToken(req, res, next) {
        let response;
        try {
            response = await securityService.isPasswordResetTokenValid(req.params.token);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in validatePasswordResetToken Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async resetPassword(req, res, next) {
        let response;
        try {
            response = await securityService.resetPassword(req.body.token, req.body.newPassword);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in resetPassword Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }
}