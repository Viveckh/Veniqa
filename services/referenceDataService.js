import * as _ from 'lodash';

import STORES_ARRAY from '../database/reference-data-files/stores.json';
import WEIGHT_UNITS_ARRAY from '../database/reference-data-files/weightUnits.json'; 
import ROLES_ARRAY from '../database/reference-data-files/roles';
import PRODUCT_CATEGORIES from '../database/reference-data-files/product-categories.json'

export default {
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
    }
}