import mongoose from 'mongoose';
import validator from 'validator';

import colorSchema from './color';

let customizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true
    }
}, {discriminatorKey: 'type', _id: false});

let customizationOptionsSchema = new mongoose.Schema({
    customizations: {
        type: [customizationSchema],
        required: true,
        validate: {
            validator: (value) => {
                return value.length > 0 && value.length < 8;
            },
            message: (props) => `Minimum of one and maximum of seven customizations allowed`
        }
    }
}, {_id: false})

// NOTE: The discriminators below faciliate the customizationOptionsSchema to have multiple types as defined below in the customizations array 

var docArray = customizationOptionsSchema.path('customizations');

docArray.discriminator('colorsArray', new mongoose.Schema({
    values: {
        type: [colorSchema],
        required: true,
        validate: {
            validator: (value) => {
                return value.length >= 2;
            },
            message: (props) => `Minimum of two options required in color array`
        }
    }
}, {_id: false}));

docArray.discriminator('stringArray', new mongoose.Schema({
    values: {
        type: [String],
        required: true,
        validate: {
            validator: (value) => {
                return value.length >= 2;
            },
            message: (props) => `Minimum of two options required in string array`
        }
    }
}, {_id: false}))

docArray.discriminator('toggle', new mongoose.Schema({
    values: {
        type: [String], 
        required: true,
        validate: {
            validator: (value) => {
                return value.length == 2;
            },
            message: (props) => `Two possible values are required`
        }
    }
}, {_id: false}));

module.exports = customizationOptionsSchema;