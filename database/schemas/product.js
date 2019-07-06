import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import validator from 'validator';
import config from 'config';
import * as _ from 'lodash';

import weightSchema from './weight';
import priceSchema from './price';
import auditLogSchema from './auditLog';
import customizationOptions from './customizationOptions';

import STORES_ARRAY from '../reference-data-files/stores.json';

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
    store_sku: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: config.get('mongodb_collections.product_categories'),
        required: true
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
    marked_price: {
        type: priceSchema,
        required: false
    },
    price: {
        type: priceSchema,
        required: true
    },
    weight: {
        type: weightSchema,
        required: true
    },
    tariff: {
        type: Schema.Types.ObjectId,
        ref: config.get('mongodb_collections.tariff_rates'),
        required: true
    },
    customizationOptions: {
        type: customizationOptions,
        required: false
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
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
});

productSchema.index({store: 'text', brand: 'text', name: 'text', store_sku: 'text', details_html: 'text'});

module.exports = productSchema;