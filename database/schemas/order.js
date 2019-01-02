import mongoose from 'mongoose';
import validator from 'validator';

import cartSchema from '../schemas/orderCart';
import addressSchema from '../schemas/address';
import paymentSchema from '../schemas/payment';

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
    }
});

module.exports = orderSchema;