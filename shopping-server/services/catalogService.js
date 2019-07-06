import Product from '../database/models/product';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async searchCatalog(pagingOptions, searchTerm, categoryIds, sortRule) {
        let result = {};
        let searchObj = searchTerm ? {$text: {$search: searchTerm}} : {};
        categoryIds ? searchObj.category = {$in: categoryIds} : '';
        searchObj.active = true; // Only return from active items

        try {
            let products = await Product.paginate(searchObj, {
                select: '_id name brand store marked_price price thumbnailUrls',
                populate: [
                    { path: 'category', select: '-_id category subcategory' }
                ],
                sort: sortRule,
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
            let product = await Product.findOne({_id: productId, active: true}).populate('category tariff').exec();
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