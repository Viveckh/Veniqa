import mongoose from 'mongoose';
import validator from 'validator';
import MONGO_COLLECTIONS from '../../properties/mongoCollections';

import productCategorySchema from '../schemas/productCategory';

productCategorySchema.index({category: 1, subcategory: 1}, {unique: true});

// The first param is the collection name this model represents
module.exports = mongoose.model(MONGO_COLLECTIONS.product_categories, productCategorySchema);