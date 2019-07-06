import mongoose from 'mongoose';
import validator from 'validator';

import priceSchema from './price';
import exchangeRateSchema from './exchangeRate';

let paymentSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        enum: ['NONE', 'STRIPE', 'BKASH', 'PAYPAL', 'KHALTI']
    },
    type: {
        type: String,
        enum: ['PENDING', 'AUTHORIZATION', 'CAPTURE', 'SALE', 'REFUND'],
        required: true
    },
    payment_id: {
        type: String,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    amount_in_usd: {
        type: priceSchema,
        required: true
    },
    exchange_rate: {
        type: exchangeRateSchema,
        required: false
    },
    amount_in_payment_currency: {
        type: priceSchema,
        required: true
    },
    payment_service_response_dump: {
        type: {},
        required: true
    }
}, {_id: false});

module.exports = paymentSchema;