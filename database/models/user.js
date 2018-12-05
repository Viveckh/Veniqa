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
    emailConfirmationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    cart: [{
        // _id field will get added automatically upon insertion
        product_id: {
            type: String,
            required: true
        },
        product_origin: {
            type: String,
            required: true,
            enum: ['curated', 'amazon', 'macys']
        },
        counts: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

// The first param is the collection name this model represents
module.exports = mongoose.model('veniqa_users', userSchema);