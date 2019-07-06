import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';
const Schema = mongoose.Schema;

import weightSchema from './weight';
import priceSchema from './price';

let cartItemSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: config.get('mongodb_collections.curated_products'),
        required: true
    },
    counts: {
        type: Number,
        required: true,
        default: 1
    },
    aggregatedWeight: {
        type: weightSchema,
        required: true,
        default: {
            quantity: 0,
            unit: 'LB'
        }
    },
    aggregatedPrice: {
        type: priceSchema,
        required: true,
        default: {
            amount: 0,
            currency: 'USD'
        }
    },
    customizations: {
        type: Map,
        of: String
    }
});


let cartSchema = new mongoose.Schema({
    items: {
        type: [cartItemSchema]
    },
    totalWeight: {
        type: weightSchema,
        required: true
    },
    subTotalPrice: {
        type: priceSchema,
        required: true
    }
}, {_id: false})


module.exports = cartSchema;