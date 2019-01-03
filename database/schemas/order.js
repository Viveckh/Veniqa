import mongoose from 'mongoose';
import validator from 'validator';

import cartSchema from './orderCart';
import addressSchema from './address';
import paymentSchema from './payment';
import commentSchema from './comment';
import auditLogSchema from './auditLog';

let orderSchema = new mongoose.Schema({
    overall_status: {
        type: String,
        required: true,
        enum: ['PENDING', 'CONFIRMED', 'ORDERED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
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