import mongoose from 'mongoose';
import validator from 'validator';
const Schema = mongoose.Schema;
import MONGO_COLLECTIONS from '../../properties/mongoCollections';

import colorSchema from './color';
import weightSchema from './weight';
import priceSchema from './price';

let cartItemSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: MONGO_COLLECTIONS.curated_products,
        required: true
    },
    counts: {
        type: Number,
        required: true,
        default: 1
    },
    aggregatedWeight: {
        type: weightSchema,
        required: true,
        default: {
            quantity: 0,
            unit: 'LB'
        }
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
    totalWeight: {
        type: weightSchema,
        required: true
    },
    subTotalPrice: {
        type: priceSchema,
        required: true
    },
    serviceCharge: {
        type: priceSchema,
        required: true
    },
    shippingPrice: {
        type: priceSchema,
        required: true
    },
    tariffPrice: {
        type: priceSchema,
        required: true
    },
    totalPrice: {
        type: priceSchema,
        required: true
    }
}, {_id: false})


module.exports = cartSchema;