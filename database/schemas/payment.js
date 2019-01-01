import mongoose from 'mongoose';
import validator from 'validator';

import priceSchema from './price';

let paymentSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        enum: ['BKASH', 'PAYPAL']
    },
    payment_id: {
        type: String,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    amount: {
        type: priceSchema,
        required: true
    }
}, {_id: false});

module.exports = paymentSchema;