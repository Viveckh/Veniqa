import mongoose from 'mongoose';
import validator from 'validator';
import MONGO_COLLECTIONS from '../../properties/mongoCollections';

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
    mailing_address: {
        type: addressSchema,
        required: true
    },
    payment_info: {
        type: [paymentSchema],
        required: true
    }
});

// The first param is the collection name this model represents
module.exports = mongoose.model(MONGO_COLLECTIONS.orders, orderSchema);