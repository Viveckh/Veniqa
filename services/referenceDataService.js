import * as _ from 'lodash';
import httpStatus from 'http-status-codes';
import ProductCategory from '../database/models/productCategory';
import Tariff from '../database/models/tariffRate';

import STORES_ARRAY from '../database/reference-data-files/stores.json';
import WEIGHT_UNITS_ARRAY from '../database/reference-data-files/weightUnits.json'; 
import ROLES_ARRAY from '../database/reference-data-files/roles';
import PRODUCT_CATEGORIES from '../database/reference-data-files/product-categories.json'

export default {
    async getCatalogBundle() {
        try {
            let result = {
                stores: STORES_ARRAY,
                product_categories: PRODUCT_CATEGORIES,
                weight_units: WEIGHT_UNITS_ARRAY,
                tariff_categories: await Tariff.find({}, '_id name').exec()
            }
            return result;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async getStores() {
        try {
            return STORES_ARRAY;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async getProductCategories() {
        try {
            return PRODUCT_CATEGORIES;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async getRoles() {
        try {
            return ROLES_ARRAY;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async getWeightUnits() {
        try {
            return WEIGHT_UNITS_ARRAY;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    },

    async getProductCategoryList() {
        let result = {};
        try {
            let productCategoryList = await ProductCategory.find({}, '-__v').exec();
    
            result = productCategoryList ? {httpStatus: httpStatus.OK, status: "successful", responseData: productCategoryList} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            console.log("Error in getProductCategoryList Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async addProductCategory(categoryObj) {
        let result = {};
        try {
            let productCategory = new ProductCategory(categoryObj);
            productCategory = await productCategory.save();
            result = productCategory ? {httpStatus: httpStatus.OK, status: "successful", responseData: productCategory} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            console.log("Error in addProductCategory Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getProductCategory(categoryId){
        let result = {};
        try {
            let productCategory = await ProductCategory.findOne({_id: categoryId}).exec();
            
            result = productCategory ? {httpStatus: httpStatus.OK, status: "successful", responseData: productCategory} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            console.log("Error in getProductCategory Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateProductCategory(categoryObj) {
        let result = {};
        try {
            // Store the id and delete it from the received object, to prevent any accidental replacement of id field
            let id = categoryObj._id;
            if (!id) {
                throw "Missing category id";
            }
            delete categoryObj._id;

            // Make the update and return the updated document. Also run validators. Mongoose warns only limited validation takes place doing this in update
            let productCategory = await ProductCategory.findOneAndUpdate({_id: id}, categoryObj, {runValidators: true, new: true}).exec();

            result = productCategory ? {httpStatus: httpStatus.OK, status: "successful", responseData: productCategory} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            console.log("Error in updateProductCategory Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getTariffList() {
        let result = {};
        try {
            let tariffList = await Tariff.find({}, '-__v').exec();
            
            result = tariffList ? {httpStatus: httpStatus.OK, status: "successful", responseData: tariffList} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async addTariffCategory(tariffObj) {
        let result = {};
        try {
            let tariff = new Tariff(tariffObj);
            tariff = await tariff.save();
            result = tariff ? {httpStatus: httpStatus.OK, status: "successful", responseData: tariff} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getTariffCategory(tariffId) {
        let result = {};
        try {
            let tariff = await Tariff.findOne({_id: tariffId}).exec();
            
            result = tariff ? {httpStatus: httpStatus.OK, status: "successful", responseData: tariff} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateTariffCategory(tariffObj) {
        let result = {};
        try {
            // Store the id and delete it from the received object, to prevent any accidental replacement of id field
            let id = tariffObj._id;
            if (!id) {
                throw "Missing tariff id";
            }
            delete tariffObj._id;

            // Make the update and return the updated document. Also run validators. Mongoose warns only limited validation takes place doing this in update
            let tariff = await Tariff.findOneAndUpdate({_id: id}, tariffObj, {runValidators: true, new: true}).exec();

            result = tariff ? {httpStatus: httpStatus.OK, status: "successful", responseData: tariff} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}