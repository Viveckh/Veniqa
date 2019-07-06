import mongoose from 'mongoose';
import validator from 'validator';

let addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true,
        enum: ['United States of America', 'Bangladesh', 'Nepal']
    },
    mobilePhone: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isMobilePhone(value)
        }
    }
})

module.exports = addressSchema;