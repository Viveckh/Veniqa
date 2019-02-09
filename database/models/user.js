import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';

import cartSchema from '../schemas/shoppingCart';
import addressSchema from '../schemas/address';

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    referral_token: {
        type: String,
        required: true,
        unique: true
    },
    emailConfirmationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    cart: {
        type: cartSchema
    },
    addresses: {
        type: [addressSchema]
    }
});


// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.users'), userSchema);