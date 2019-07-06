import FeaturedSectionModel from '../database/models/userInterface/featuredSections';
import httpStatus from 'http-status-codes';
import logger from '../logging/logger';

export default {
    async updateOrUpsertFeaturedSection(featuredSectionObj) {
        let result = {}
        try {
            let section = await FeaturedSectionModel.findOneAndUpdate({name: featuredSectionObj.name}, featuredSectionObj,{upsert: true, runValidators: true, new: true}).populate('content.products', '_id name brand store marked_price price thumbnailUrls detailedImageUrls featuredImageUrls').exec();
            result = section ? {httpStatus: httpStatus.OK, status: "successful", responseData: section} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            logger.error("Error in updateOrUpsertFeaturedSection", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getAllFeaturedSections(){
        let result = {};
        try {
            let sections = await FeaturedSectionModel.find({}).populate('content.products', '_id name brand store marked_price price thumbnailUrls detailedImageUrls featuredImageUrls').exec();
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: sections};
            return result;
        }
        catch(err) {
            logger.error("Error in getAllFeaturedSections", {meta: err});
            result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err};
            return result;
        }
    },

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

    async deleteFeaturedSection(name) {
        let result = {};
        try {
            let section = await FeaturedSectionModel.remove({name: name}).exec();
            result = section ? {httpStatus: httpStatus.OK, status: "successful", responseData: true} : {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            return result;
        }
        catch(err) {
            logger.error("Error in deleteFeaturedSection", {meta: err});
            result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: err};
            return result;
        }
    }
}

