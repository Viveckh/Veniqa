import axios from 'axios';
import config from 'config';
import logger from '../logging/logger';

export default {
    async verifyTransaction(token, amountInNPR) {
        try {
            // Preparing the request body
            let data = {
                token: token,
                amount: amountInNPR
            };
            
            // Preparing the config with authorization headers
            let khaltiConfig = {
                headers: { Authorization: 'Key ' + process.env.VENIQA_KHALTI_API_KEY }
            };
        
            // Make the API request to Khalti
            response = await axios.post(config.get('khalti.verification_url'), data, khaltiConfig);
            
            // Check the response and return the values
            return response.data;
        }
        catch(err) {
            // Let the caller handle it
            throw err.response.data;
        }
    }
}