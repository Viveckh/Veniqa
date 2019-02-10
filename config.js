// Configuration and environment module imports
import config from 'config';
import dotenv from 'dotenv';
import fs from 'fs';

// Set environment variables
if (process.env.NODE_ENV == 'production') {
    // Load the .env file from the system location where it is stored
    // dotenv.config({path: '/var/veniqa'}); // Since an override option is missing, using the hack below
    const envConfig = dotenv.parse(fs.readFileSync('/home/veniqa/client-server/production/.env'))
    for (let k in envConfig) {
        process.env[k] = envConfig[k]
    }
  }
  else {
    // Load the .env file from the project root
    // dotenv.config({debug: process.env.DEBUG}); // Since an override option is missing, using the hack below
    const envConfig = dotenv.parse(fs.readFileSync('/etc/veniqa/client-server/development/.env'))
    for (let k in envConfig) {
        process.env[k] = envConfig[k]
    }
}
