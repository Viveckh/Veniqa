import mongoose from 'mongoose';
import validator from 'validator';

import priceSchema from './price';

let shipmentSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['LOADING', 'SHIPPED'],
        default: 'LOADING'
    },
    provider: {
        type: String,
        enum: ['MYUS', 'USPS', 'UPS', 'FEDEX', 'DHL'],
        required: function() {
            return this.status != 'LOADING';
        }
    },
    service: {
        type: String,
        required: function() {
            return this.status != 'LOADING';
        }
    },
    paid_postage: {
        type: priceSchema,
        required: function() {
            return this.status != 'LOADING';
        }
    },
    tracking_number: {
        type: String,
        required: function() {
            return this.status != 'LOADING';
        }
    }
}, {_id: false});

module.exports = shipmentSchema;