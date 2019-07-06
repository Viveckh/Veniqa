import mongoose from 'mongoose';
import validator from 'validator';
import config from 'config';

import tariffRateSchema from '../schemas/tariffRate';

// The first param is the collection name this model represents
module.exports = mongoose.model(config.get('mongodb_collections.tariff_rates'), tariffRateSchema);