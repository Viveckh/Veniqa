import axios from 'axios';
import khaltiConfig from '../properties/khalti.json';
import logger from '../logging/logger';

export default {
    verifyTransaction(token, amountInNPR) {
        try {
            // Preparing the request body
            let data = {
                token: token,
                amount: amountInNPR
            };
            
            // Preparing the config with authorization headers
            let config = {
                headers: { Authorization: 'Key ' + khaltiConfig.test_secret_key }
            };
        
            // Make the API request to Khalti
            response = await axios.post(khaltiConfig.verification_url, data, config);

            // Check the response and return the values
            return response.data;
        }
        catch(err) {
            // Let the caller handle it
            throw err;
        }
    }
}