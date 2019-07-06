import mongoose from 'mongoose';
import validator from 'validator';

import cartSchema from './orderCart';
import addressSchema from './address';
import paymentSchema from './payment';
import commentSchema from './comment';
import auditLogSchema from './auditLog';

import ORDER_STATUSES from '../reference-data-files/order-statuses.json';

let orderSchema = new mongoose.Schema({
    overall_status: {
        type: String,
        required: true,
        enum: ORDER_STATUSES.order_level,
        default: 'RECEIVED'
    },
    cart: {
        type: cartSchema,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    mailing_address: {
        type: addressSchema,
        required: true
    },
    payment_info: {
        type: [paymentSchema],
        required: true
    },
    comments: {
        type: [commentSchema],
        required: true
    },
    auditLog: {
        type: auditLogSchema,
        required: true
    }
});

module.exports = orderSchema;