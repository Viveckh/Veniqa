import mongoose from 'mongoose';
import validator from 'validator';
import mongoosePaginator from 'mongoose-paginate';
import config from 'config';

import orderSchema from '../schemas/order';

// Add the paginator plugin to the schema
orderSchema.plugin(mongoosePaginator);

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.orders'), orderSchema);