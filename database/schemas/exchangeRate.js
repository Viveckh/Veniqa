import mongoose from 'mongoose';
import validator from 'validator';

let exchangeRateSchema = new mongoose.Schema({
    currency: {
        type: String,
        required: true,
        enum: ['BDT', 'NPR']
    },
    one_usd_equals: {
        type: Number,
        required: true
    }
});

module.exports = exchangeRateSchema;