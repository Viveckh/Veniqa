import mongoose from 'mongoose';
import validator from 'validator';
import auditorSchema from './auditor';
import auditLogSchema from './auditLog';

let commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: auditorSchema,
        required: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
});

module.exports = commentSchema;