// Configuration and environment module imports
import dotenv from 'dotenv';

// Set environment variables
if (process.env.NODE_ENV == 'production') {
    if (process.env.VENIQA_ENV == 'aws' || process.env.VENIQA_ENV == 'azure') {
        // Do nothing, all the env variables should be availed separately to aws/azure
    }
    else {
        // Load the .env file from the system location where it is stored
        dotenv.config();
    }
}
else {
    if (process.env.VENIQA_ENV == 'aws' || process.env.VENIQA_ENV == 'azure') {
        // Do nothing, all the env variables should be availed separately to aws/azure
    }
    else {
        // Load the .env file from the system location where it is stored
        dotenv.config();
    }
}