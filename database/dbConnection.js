import mongoose from 'mongoose';
import config from '../properties/mongodb'
import logger from '../logging/logger';

let dbConnection;

let getDBConnection = async() => {
    try {
        // Establish a mongoose connection to mongodb
        dbConnection = await mongoose.connect(config.url, config.options, (error) => {
                        if (error) {
                            logger.error("Could not establish connection to database", {meta: error});
                            return;
                        }
                        logger.info("MongoDB connection was successful");
                    });
    }
    catch(err) {
        logger.error("Error connecting to the database", {meta: err});
    }
    return dbConnection;
}

getDBConnection();

// Initializing the models and registering them to their models
require("./models/product")
require("./models/user");

// Exporting the connection
exports.dbConnection = () => dbConnection;
