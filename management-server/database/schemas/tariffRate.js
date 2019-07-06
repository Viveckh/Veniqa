import mongoose from 'mongoose';
import validator from 'validator';

let countryWiseRateSchema = new mongoose.Schema({
    "Nepal": {
        type: Number,
        required: true,
        min: 0
    },
    "Bangladesh": {
        type: Number,
        required: true,
        min: 0
    }
}, {_id: false});

let tariffRateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    rates: {
        type: countryWiseRateSchema,
        required: true
    }
});

module.exports = tariffRateSchema;