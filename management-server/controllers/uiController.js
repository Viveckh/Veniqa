import uiService from '../services/uiService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async updateOrUpsertFeaturedSection(req, res, next) {
        let response;
        try {
            response = await uiService.updateOrUpsertFeaturedSection(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in updateOrUpsertFeaturedSection Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getAllFeaturedSections(req, res, next) {
        let response;
        try {
            response = await uiService.getAllFeaturedSections();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getAllFeaturedSections Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getFeaturedSection(req, res, next) {
        let response;
        try {
            response = await uiService.getFeaturedSection(req.query.name);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getFeaturedSection Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async deleteFeaturedSection(req, res, next) {
        let response;
        try {
            response = await uiService.deleteFeaturedSection(req.body.name);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in deleteFeaturedSection Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },
}