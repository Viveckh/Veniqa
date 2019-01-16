import referenceDataService from '../services/referenceDataService';
import httpStatus from 'http-status-codes';

export default {
    async getCatalogBundle(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getCatalogBundle();
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting catalog bundle failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getStores(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getStores();
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting stores failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getProductCategories(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getProductCategories();
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting product categories failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getRoles(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getRoles();
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting roles failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
        }
    },

    async getWeightUnits(req, res, next) {
        let response;
        try {
            response = await referenceDataService.getWeightUnits();
            if (response.code) {
                return res.status(400).send({mongoErrorCode: response.code, mongoErrorMsg: response.errmsg});
            }
            return res.status(200).send(response);
        }
        catch(err) {
            console.log("[ERROR]: Getting weight units failed => ", err);
            return res.status(500).send({ errorCode: "server error", errorMsg: err});
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