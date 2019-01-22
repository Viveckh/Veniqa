import Product from '../database/models/product';
import logger from '../logging/logger'

export default {
    async searchCatalog(searchTerm, pagingOptions) {
        let searchObj = searchTerm ? {$text: {$search: searchTerm}} : {};
        try {
            let products = await Product.paginate(searchObj, {
                select: '_id name brand store price thumbnailUrls',
                populate: [
                    { path: 'category', select: '-_id category subcategory' }
                ],
                page: pagingOptions.page,
                limit: pagingOptions.limit
            }).then(result => {
                return result;
            }).catch(err => {
                return err;
            })
            return products;
        }   
        catch(err) {
            logger.error("Error in searchCatalog Service", {meta: err})
            return err;
        }
    },

    async getProductDetails(productId) {
        let result = {};
        try {
            let product = await Product.findOne({_id: productId}).populate('category tariff').exec()
            if (product) {
                result = {status: "successful", responseData: product};
            } 
            else { 
                result = {status: "failed", errorDetails: "product not found"};
            }
            return result;  
        }
        catch(err) {
            logger.error("Error in getProductDetails Service", {meta: err})
            result = {status: "failed", errorDetails: err};
            return result;
        }
    }
}