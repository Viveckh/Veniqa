import mongoose from 'mongoose';
import validator from 'validator';
import MONGO_COLLECTIONS from '../../properties/mongoCollections';

import cartSchema from '../schemas/cart';
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
module.exports = mongoose.model(MONGO_COLLECTIONS.users, userSchema);