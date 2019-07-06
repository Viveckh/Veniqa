import mongoose from 'mongoose';
import validator from 'validator';

import auditLogSchema from './auditLog';
import priceSchema from './price';

let shipmentSchema = new mongoose.Schema({
    provider: {
        type: String,
        enum: ['MYUS', 'USPS', 'UPS', 'FEDEX', 'DHL'],
        required: true
    },
    tracking_number: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    paid_postage: {
        type: priceSchema,
        required: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
}, {_id: false});

module.exports = shipmentSchema;