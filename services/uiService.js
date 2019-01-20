import FeaturedSectionModel from '../database/models/userInterface/featuredSections';
import logger from '../logging/logger'
import httpStatus from 'http-status-codes';

export default {
    async getFeaturedSection(name){
        let result = {};
        try {
            let section = await FeaturedSectionModel.findOne({name: name}).exec();
            result = section ? {httpStatus: httpStatus.OK, status: "successful", responseData: section} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            logger.error("Error in getFeaturedSection", {meta: err});
            result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err};
            return result;
        }
    }
}

