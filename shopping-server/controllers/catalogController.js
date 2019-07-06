import catalogService from "../services/catalogService";
import httpStatus from 'http-status-codes';
import logger from '../logging/logger'

export default {
    async searchCatalog(req, res, next) {
        let response;
        try {
            response = await catalogService.searchCatalog(req.body.pagingOptions, req.body.searchTerm, req.body.categoryIds, req.body.sortRule);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in searchCatalog Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getProductDetails(req, res, next) {
        let response;
        try {
            response = await catalogService.getProductDetails(req.query.productId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getProductDetails Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    }

}