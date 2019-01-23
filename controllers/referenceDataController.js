import referenceDataService from '../services/referenceDataService';
import httpStatus from 'http-status-codes';

export default {
    async getCatalogBundle(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getCatalogBundle();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getCatalogBundle Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getStores(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getStores();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getStores Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getRoles(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getRoles();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getRoles Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getWeightUnits(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getWeightUnits();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getWeightUnits Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getProductCategoryList(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getProductCategoryList();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getProductCategoryList Controller", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async addProductCategory(req, res, next) {
        let response;
        try {
            response = await referenceDataService.addProductCategory(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in addProductCategory Controller", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getProductCategory(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getProductCategory(req.query.categoryId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getProductCategory Controller", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateProductCategory(req, res, next) {
        let response;
        try {
            response = await referenceDataService.updateProductCategory(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in updateProductCategory Controller", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getTariffList(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getTariffList();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getTariffList Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async addTariffCategory(req, res, next) {
        let response;
        try {
            response = await referenceDataService.addTariffCategory(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in addTariffCategory Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async getTariffCategory(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getTariffCategory(req.query.tariffId);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in getTariffCategory Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },

    async updateTariffCategory(req, res, next) {
        let response;
        try {
            response = await referenceDataService.updateTariffCategory(req.body);
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            console.log("Error in updateTariffCategory Controller ->", err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },



}