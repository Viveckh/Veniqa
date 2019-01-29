import catalogService from "../services/catalogService";
import httpStatus from 'http-status-codes';

export default {
    async searchCatalog(req, res, next) {
        let response;
        try {
            response = await catalogService.searchCatalog(req.body.pagingOptions, req.body.searchTerm, req.body.sortRule);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in searchCatalog Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async addProductToCatalog(req, res, next) {
        let response;
        try {
            response = await catalogService.addProductToCatalog(req.body, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in addProductToCatalog Controller ->", err);
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
            console.log("Error in getProductDetails Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateProductInCatalog(req, res, next) {
        let response;
        try {
            response = await catalogService.updateProductInCatalog(req.body, req.user);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in updateProductInCatalog Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async deleteProductFromCatalog(req, res, next) {
        let response;
        try {
            response = await catalogService.deleteProductFromCatalog(req.body.productId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in deleteProductFromCatalog Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getPresignedUrlsForCatalogImageUploads(req, res, next) {
        let response;
        try {
            response = await catalogService.getPresignedUrlsForCatalogImageUploads(req.query.productId, req.query.numberOfThumbnailAndDetailedImages, req.query.numberOfFeaturedImages);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getPresignedUrlsForCatalogImageUploads Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }   
    }
}