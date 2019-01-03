import mongoose from 'mongoose';
import validator from 'validator';

import auditorSchema from './auditor';

let auditLogSchema = new mongoose.Schema({
    createdBy: {
        type: auditorSchema,
        required: true
    },
    updatedBy: {
        type: auditorSchema,
        required: true
    }
}, { _id: false, timestamps: true});

module.exports = auditLogSchema;