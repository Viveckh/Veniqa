import mongoose from 'mongoose';
import validator from 'validator';

import auditLogSchema from './auditLog';

let deliverySchema = new mongoose.Schema({
    delivery_date: {
        type: Date,
        required: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
}, {_id: false});

module.exports = deliverySchema;