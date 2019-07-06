import uiService from '../services/uiService';
import logger from '../logging/logger'
import httpStatus from 'http-status-codes';

export default {
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

    async getProductCategoryList(req, res, next) {
        let response;
        try {
            response = await uiService.getProductCategoryList();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getProductCategoryList Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }

}