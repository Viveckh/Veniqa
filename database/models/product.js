import mongoose from 'mongoose';
import validator from 'validator';
import mongoosePaginator from 'mongoose-paginate';

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

let productSchema = new mongoose.Schema({
    store: {
        type: String,
        required: true,
        trim: true,
        enum: ['CURATED', 'AMAZON', 'MACYS', 'SEPHORA', 'EBAY', 'MICHAEL KORS']
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    item_url: {
        type: String,
        required: true,
        trim: true,
        validate: (value) => {
            return validator.isURL(value, {allow_underscores: true})
        }
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true
    },
    thumbnailUrls: {
        type: Array,
        of: String,
        required: true,
        validate: (value) => {
            for (let entry of value) {
                if(!(validator.isURL(entry, {allow_underscores: true}) && entry.includes("s3.amazonaws.com"))) {
                    return false;
                }
            }
            return true;
        }
    },
    featuredImageUrls: {
        type: Array,
        of: String,
        required: true,
        validate: (value) => {
            for (let entry of value) {
                if(!(validator.isURL(entry, {allow_underscores: true}) && entry.includes("s3.amazonaws.com"))) {
                    return false;
                }
            }
            return true;
        }
    },
    detailedImageUrls: {
        type: Array,
        of: String,
        required: true,
        validate: (value) => {
            for (let entry of value) {
                if(!(validator.isURL(entry, {allow_underscores: true}) && entry.includes("s3.amazonaws.com"))) {
                    return false;
                }
            }
            return true;
        }
    },
    price: {
        type: priceSchema,
        required: true
    },
    weight: {
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true,
            enum: ['LB', 'KG', 'OZ']
        }
    },
    custom_attributes: {
        type: Map,
        of: String
    },
    details_html: {
        type: String,
        required: true,
        trim: true
    },
    colors: {
        type: [colorSchema],
        required: false
    },
    sizes: {
        type: [String],
        required: false
    }
});

// Add the paginator plugin to the schema
productSchema.plugin(mongoosePaginator);

// The first param is the collection name this model represents
module.exports = mongoose.model('veniqa_curated_products', productSchema);