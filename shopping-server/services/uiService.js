import FeaturedSectionModel from '../database/models/userInterface/featuredSections';
import ProductCategory from '../database/models/productCategory';
import logger from '../logging/logger'
import httpStatus from 'http-status-codes';

export default {
    async getFeaturedSection(name){
        let result = {};
        try {
            let section = await FeaturedSectionModel.findOne({name: name}).populate('content.products', '_id name brand store marked_price price thumbnailUrls detailedImageUrls featuredImageUrls').exec();
            result = section ? {httpStatus: httpStatus.OK, status: "successful", responseData: section} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            logger.error("Error in getFeaturedSection", {meta: err});
            result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getProductCategoryList() {
        let result = {};
        try {
            let productCategoryList = await ProductCategory.find({}, '-__v').exec();
    
            result = productCategoryList ? {httpStatus: httpStatus.OK, status: "successful", responseData: productCategoryList} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            logger.error("Error in getProductCategoryList Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },
}

