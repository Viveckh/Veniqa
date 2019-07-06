import mongoose from 'mongoose';
import validator from 'validator';

let auditorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    name: {
        type: String,
        required: true
    }
}, { _id: false});

module.exports = auditorSchema;