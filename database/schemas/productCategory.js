import mongoose from 'mongoose';
import validator from 'validator';

let productCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    }
});

module.exports = productCategorySchema;