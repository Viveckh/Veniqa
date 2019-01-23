import Product from '../database/models/product';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async searchCatalog(searchTerm, pagingOptions) {
        let result = {};
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

            result = {httpStatus: httpStatus.OK, status: "successful", responseData: products};
            return result;
        }   
        catch(err) {
            logger.error("Error in searchCatalog Service", {meta: err})
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getProductDetails(productId) {
        let result = {};
        try {
            let product = await Product.findOne({_id: productId}).populate('category tariff').exec();
            result = product ? {httpStatus: httpStatus.OK, status: "successful", responseData: product} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            logger.error("Error in getProductDetails Service", {meta: err})
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}