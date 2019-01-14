import mongoose from 'mongoose';
import validator from 'validator';
import auditLogSchema from './auditLog';

let commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
});

module.exports = commentSchema;