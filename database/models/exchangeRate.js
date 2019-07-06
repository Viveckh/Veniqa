import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';

import exchangeRateSchema from '../schemas/exchangeRate';

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.exchange_rates'), exchangeRateSchema);