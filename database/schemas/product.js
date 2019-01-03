import mongoose from 'mongoose';
import validator from 'validator';
import * as _ from 'lodash';

import colorSchema from './color';
import weightSchema from './weight';
import priceSchema from './price';
import auditLogSchema from './auditLog';

import STORES_ARRAY from '../reference-data-files/stores.json';
import PRODUCT_CATEGORIES from '../reference-data-files/product-categories.json'

let productSchema = new mongoose.Schema({
    store: {
        type: String,
        required: true,
        trim: true,
        enum: STORES_ARRAY
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    item_url: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            return validator.isURL(value, {allow_underscores: true})
        }
    },
    category: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            // Get all category names and check if the passed value is one of them
            let categoriesArray = _.map(PRODUCT_CATEGORIES, 'name');
            return categoriesArray.includes(value);
        }
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
        /*
        validate: function(value) {
            // Find the selected category object and see if the subcategory exists in subcategories array
            let categoryObj = _.find(PRODUCT_CATEGORIES, {name: this.category})
            return categoryObj && categoryObj.subcategories && categoryObj.subcategories.includes(value);
        }
        */
    },
    thumbnailUrls: {
        type: Array,
        of: String,
        required: true,
        validate: (value) => {
            for (let entry of value) {
                if(!(validator.isURL(entry, {allow_underscores: true}) && entry.includes("s3.amazonaws.com"))) {
                    return false;
                }
            }
            return true;
        }
    },
    featuredImageUrls: {
        type: Array,
        of: String,
        required: true,
        validate: (value) => {
            for (let entry of value) {
                if(!(validator.isURL(entry, {allow_underscores: true}) && entry.includes("s3.amazonaws.com"))) {
                    return false;
                }
            }
            return true;
        }
    },
    detailedImageUrls: {
        type: Array,
        of: String,
        required: true,
        validate: (value) => {
            for (let entry of value) {
                if(!(validator.isURL(entry, {allow_underscores: true}) && entry.includes("s3.amazonaws.com"))) {
                    return false;
                }
            }
            return true;
        }
    },
    price: {
        type: priceSchema,
        required: true
    },
    weight: {
        type: weightSchema,
        required: true
    },
    custom_attributes: {
        type: Map,
        of: String
    },
    details_html: {
        type: String,
        required: true,
        trim: true
    },
    colors: {
        type: [colorSchema],
        required: false
    },
    sizes: {
        type: [String],
        required: false
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
});

module.exports = productSchema;