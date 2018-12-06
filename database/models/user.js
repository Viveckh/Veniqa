import mongoose from 'mongoose';
import validator from 'validator';

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
    permissions: {
        type: [String],
        required: true,
        enum: ['SUPERADMIN', 'ORDER_VIEW', 'ORDER_MANAGE', 'CATALOG_VIEW', 'CATALOG_MANAGE']
    },
    emailConfirmationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date
});

// The first param is the collection name this model represents
module.exports = mongoose.model('veniqa_admins', userSchema);