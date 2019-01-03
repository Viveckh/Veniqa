import mongoose from 'mongoose';
import validator from 'validator';

import WEIGHT_UNITS_ARRAY from '../reference-data-files/weightUnits.json'; 

let weightSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true,
        enum: WEIGHT_UNITS_ARRAY
    }
}, {_id: false})

module.exports = weightSchema;