import mongoose from 'mongoose';
import validator from 'validator';
import mongoosePaginator from 'mongoose-paginate';
import MONGO_COLLECTIONS from '../../properties/mongoCollections';

import productSchema from '../schemas/product';

// Add the paginator plugin to the schema
productSchema.plugin(mongoosePaginator);

// The first param is the collection name this model represents
module.exports = mongoose.model(MONGO_COLLECTIONS.curated_products, productSchema);