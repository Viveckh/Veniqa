import mongoose from 'mongoose';
import validator from 'validator';

let productSubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

let productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subcategories: {
        type: [productSubcategorySchema],
        required: true,
        validate: {
            validator: (value) => {
                return value.length > 0;
            },
            message: (props) => `Minimum of one subcategory required`
        }
    }
});

module.exports = productCategorySchema;