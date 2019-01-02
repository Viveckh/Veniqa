import mongoose from 'mongoose';
import validator from 'validator';
import MONGO_COLLECTIONS from '../../properties/mongoCollections';

import checkoutSchema from '../schemas/order';

// The first param is the collection name this model represents
module.exports = mongoose.model(MONGO_COLLECTIONS.checkouts, checkoutSchema);