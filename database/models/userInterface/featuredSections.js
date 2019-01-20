import mongoose from 'mongoose';
import validator from 'validator';
const Schema = mongoose.Schema;
import MONGO_COLLECTIONS from '../../../properties/mongoCollections';

let featuredContentSchema = new mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: MONGO_COLLECTIONS.curated_products,
        required: true
    },
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
module.exports = mongoose.model(MONGO_COLLECTIONS.ui_featured_sections, featuredSectionsSchema);