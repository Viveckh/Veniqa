import referenceDataService from '../services/referenceDataService';

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



}