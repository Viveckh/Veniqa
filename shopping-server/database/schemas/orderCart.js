import mongoose from 'mongoose';
import validator from 'validator';

import weightSchema from './weight';
import priceSchema from './price';
import productSchema from './product';
import orderLineLevelProcessingSchema from './orderLineLevelProcessing';

let cartItemSchema = new mongoose.Schema({
    product: {
        type: productSchema,
        required: true
    },
    order_line_level_processing_details: {
        type: orderLineLevelProcessingSchema,
        required: false
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
    customizations: {
        type: Map,
        of: String
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