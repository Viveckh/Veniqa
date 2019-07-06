import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';
import ROLES_ARRAY from '../reference-data-files/roles';

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
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    permissions: {
        type: [String],
        required: true,
        enum: ROLES_ARRAY,
        validate: (value) => {
            return value.length > 0
        }
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.admins'), userSchema);