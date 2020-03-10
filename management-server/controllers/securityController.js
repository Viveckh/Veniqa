import securityService from '../services/securityService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
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
    },

    login(req, res, next) {
        // If this part gets executed, it means authentication was successful
        // Regenerating a new session ID after the user is authenticated
        let temp = req.session.passport;
        req.session.regenerate((err) => {
            req.session.passport = temp;
            req.session.save((err) => {
                res.status(httpStatus.OK).send({
                    email: req.user.email,
                    name: req.user.name,
                    permissions: req.user.permissions
                });
            })
        });
    },

    logout(req, res, next) {
        // Since there is no really logic in this and passport is doing most of the job, putting the response logic in controller.
        req.logout();
        if (req.session) {
            req.session.destroy((err) => {
                if(err) {
                    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("server error - could not clear out session info completely")
                }
                return res.status(httpStatus.OK).send("logged out successfully");
            });
        }
        else {
            if (req.isUnauthenticated()) {
                return res.status(httpStatus.OK).send("logged out successfully");
            }
            else {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).send("server error - could not log out")
            }
        }
    }
}