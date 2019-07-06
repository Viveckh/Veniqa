import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';

import productCategorySchema from '../schemas/productCategory';

productCategorySchema.index({category: 1, subcategory: 1}, {unique: true});

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.product_categories'), productCategorySchema);