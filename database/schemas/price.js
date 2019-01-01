import mongoose from 'mongoose';
import validator from 'validator';

let priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD']
    }
}, {_id: false})

module.exports = priceSchema; 