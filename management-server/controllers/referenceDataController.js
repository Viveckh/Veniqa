import referenceDataService from '../services/referenceDataService';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async getCatalogBundle(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getCatalogBundle();
            return res.status(response.httpStatus).send(response);
        }
        catch(err) {
            logger.error("Error in getCatalogBundle Controller", {meta: err});
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
            logger.error("Error in getStores Controller", {meta: err});
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
            logger.error("Error in getRoles Controller", {meta: err});
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
            logger.error("Error in getWeightUnits Controller", {meta: err});
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
            logger.error("Error in getProductCategoryList Controller", {meta: err});
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
            logger.error("Error in addProductCategory Controller", {meta: err});
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
            logger.error("Error in getProductCategory Controller", {meta: err});
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
            logger.error("Error in updateProductCategory Controller", {meta: err});
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
            logger.error("Error in getTariffList Controller", {meta: err});
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
            logger.error("Error in addTariffCategory Controller", {meta: err});
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
            logger.error("Error in getTariffCategory Controller", {meta: err});
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
            logger.error("Error in updateTariffCategory Controller", {meta: err});
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err});
        }
    },



}