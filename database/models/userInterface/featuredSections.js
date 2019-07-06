import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';
const Schema = mongoose.Schema;

let featuredContentSchema = new mongoose.Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: config.get('mongodb_collections.curated_products')
    }],
    config: {
        type: {},
        required: true
    }
}, {_id: false})

let featuredSectionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: [featuredContentSchema],
        required: true
    }
});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.ui_featured_sections'), featuredSectionsSchema);