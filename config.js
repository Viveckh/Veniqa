// Configuration and environment module imports
import config from 'config';
import dotenv from 'dotenv';
import fs from 'fs';

// Set environment variables
if (process.env.NODE_ENV == 'production') {
    if (process.env.VENIQA_ENV == 'aws' || process.env.VENIQA_ENV == 'azure') {
        // Do nothing, all the env variables should be availed separately to aws/azure
    }
    else {
        // Load the .env file from the system location where it is stored
        const envConfig = dotenv.parse(fs.readFileSync('/etc/veniqa/client-server/.env.production'))
        for (let k in envConfig) {
            process.env[k] = envConfig[k]
        }
    }
}
else {
    if (process.env.VENIQA_ENV == 'aws' || process.env.VENIQA_ENV == 'azure') {
        // Do nothing, all the env variables should be availed separately to aws/azure
    }
    else {
        // Load the .env file from the system location where it is stored
        const envConfig = dotenv.parse(fs.readFileSync('/etc/veniqa/client-server/.env.development'))
        for (let k in envConfig) {
            process.env[k] = envConfig[k]
        }
    }
}