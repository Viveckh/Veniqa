import mongoose from 'mongoose';
import validator from 'validator';

import auditLogSchema from './auditLog';
import priceSchema from './price';

import STORES_ARRAY from '../reference-data-files/stores.json';

let fulfillmentOrderLineLevelSchema = new mongoose.Schema({
    store: {
        type: String,
        required: true
    },
    order_number: {
        type: String,
        required: true
    },
    total_cost_price_of_item: {
        type: priceSchema,
        required: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
}, {_id: false});

module.exports = fulfillmentOrderLineLevelSchema;