import mongoose from 'mongoose';
import config from '../properties/mongodb'

let dbConnection;

let getDBConnection = async() => {
    try {
        // Establish a mongoose connection to mongodb
        dbConnection = await mongoose.connect(config.url, config.options, (error) => {
                        if (error) {
                            console.log("Could not establish connection to database", error)
                            return;
                        }
                        console.log("MongoDB connection was successful")
                    });
    }
    catch(err) {
        console.log("Error connecting to the database", err);
    }
    return dbConnection;
}

getDBConnection();

// Initializing the models and registering them to their models
require("./models/product")
require("./models/user");

// Exporting the connection
exports.dbConnection = () => dbConnection;
