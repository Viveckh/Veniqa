import mongoose from 'mongoose';
import validator from 'validator';
import MONGO_COLLECTIONS from '../../../properties/mongoCollections';

let featuredSectionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: {},
        required: true
    }
});

// The first param is the collection name this model represents
module.exports = mongoose.model(MONGO_COLLECTIONS.ui_featured_sections, featuredSectionsSchema);