import mongoose from 'mongoose';
import validator from 'validator';

let colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hexValue: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isHexColor(value)
        }
    }
}, {_id: false});

let priceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'BDT', 'NPR']
    }
}, {_id: false})

let cartItemSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    counts: {
        type: Number,
        required: true,
        default: 1
    },
    aggregatedPrice: {
        type: priceSchema,
        required: true,
        default: {
            amount: 0,
            currency: 'USD'
        }
    },
    color: {
        type: colorSchema,
        required: false,
    },
    size: {
        type: String,
        required: false
    }
});


let cartSchema = new mongoose.Schema({
    items: {
        type: [cartItemSchema]
    },
    totalPrice: {
        type: priceSchema,
        required: true
    }
}, {_id: false})

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
module.exports = mongoose.model('veniqa_users', userSchema);