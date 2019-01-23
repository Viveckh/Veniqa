import Product from '../database/models/product';
import cryptoGen from '../authentication/cryptoGen';
import awsConnections from '../cloudservices/awsConnections';
import awsConfig from '../properties/aws-config';
import httpStatus from 'http-status-codes';

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
            console.log("Error in searchCatalog Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async addProductToCatalog(productObj, userObj){
        let result = {};
        try {
            let product = new Product(productObj);
            product.auditLog = {
                createdBy: {email: userObj.email, name: userObj.name},
                updatedBy: {email: userObj.email, name: userObj.name},
                createdOn: new Date(),
                updatedOn: new Date()
            }
            product = await product.save();

            result = product ? {httpStatus: httpStatus.OK, status: "successful", responseData: product} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            console.log("Error in addProductToCatalog Service", {meta: err});
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
            console.log("Error in getProductDetails Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateProductInCatalog(productObj, userObj) {
        let result = {};
        try {
            // Store the id and delete it from the received object, to prevent any accidental replacement of id field
            let id = productObj._id;
            if (!id) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Missing Product ID"};
                return result;
            }
            delete productObj._id;

            // Change audit related info
            let auditLog = await Product.findOne({_id: id}, '-_id auditLog').exec();
            auditLog.auditLog.updatedBy = {email: userObj.email, name: userObj.name};
            auditLog.auditLog.updatedOn = new Date();
            productObj.auditLog = auditLog.auditLog;
            
            // Make the update and return the updated document. Also run validators. Mongoose warns only limited validation takes place doing this in update
            let product = await Product.findOneAndUpdate({_id: id}, productObj, {runValidators: true, new: true}).populate('category tariff').exec();
            result = product ? {httpStatus: httpStatus.OK, status: "successful", responseData: product} : {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
            return result;
        }
        catch(err) {
            console.log("Error in updateProductInCatalog Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteProductFromCatalog(productId){
        let result = {};
        try {
            // Remove the product
            let product = await Product.remove({_id: productId}).exec();
            
            // We are not deleting the images associated with the product from S3, because those links will be referenced in order tables if the product was previously ordered

            result = product ? {httpStatus: httpStatus.OK, status: "successful", responseData: product} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            console.log("Error in deleteProductFromCatalog Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getPresignedUrlsForCatalogImageUploads(productId, numberOfThumbnailAndDetailedImages, numberOfFeaturedImages) {
        let result = {};
        try {
            // Limit the max number of images the urls can be requested for at once.
            if (numberOfThumbnailAndDetailedImages > 7 || numberOfFeaturedImages > 7) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Maximum number of allowed images for each type is 7"};
                return result;
            }

            let folderName, product;
            // If a productId was passed and the product is found, use its existing image urls to find corresponding s3 folder, otherwise generate a new folder name
            if (productId) {
                product = await Product.findOne({_id: productId}).exec()
                if (product && product.detailedImageUrls && product.detailedImageUrls.length > 0) {
                    // Extracting the folder name
                    let extractionUrl = product.detailedImageUrls[0];
                    folderName = extractionUrl.split('/')[4]; // That's the index in the url where the folder name for a catalog will be
                } 
                else { 
                    folderName = await cryptoGen.generateRandomToken();
                }
            }
            else {
                // Generate a random folder name to put contents
                folderName = await cryptoGen.generateRandomToken();
            }
            
            // Prepare the object which will contain the urls
            let response = {
                thumbnailUrls: [],
                detailedImageUrls: [],
                featuredImageUrls: []
            }

            // Generate the thumbnail and detailed image urls to push to the response object
            for (let index = 0; index < numberOfThumbnailAndDetailedImages; index++) {
                // If there is a previous file that can be replaced, use its name
                let filename = (product && product.detailedImageUrls[index]) ? product.detailedImageUrls[index].split('/')[6] : await cryptoGen.generateRandomToken();

                // GENERATE LINKS FOR THE THUMBNAIL FIRST
                let thumbnailObjectKey = folderName + "/thumbnails/" + filename;
                let thumbnailLiveUrl = awsConfig.S3_RESOURCE_LIVE_BASE_URL + "/" + awsConfig.VENIQA_CATALOG_IMAGE_BUCKET + "/" + thumbnailObjectKey;

                let thumbnailUploadUrl = awsConnections.s3.getSignedUrl('putObject', {
                    Bucket: awsConfig.VENIQA_CATALOG_IMAGE_BUCKET,
                    Key: thumbnailObjectKey,
                    ContentType: 'image/png',
                    Expires: awsConfig.PRESIGNED_URL_EXPIRES_IN
                });

                response.thumbnailUrls.push({
                    uploadUrl: thumbnailUploadUrl,
                    liveUrl: thumbnailLiveUrl
                })


                // GENERATE LINKS FOR THE DETAILED IMAGES NEXT
                let detailedImageObjectKey = folderName + "/detailed-images/" + filename;
                let detailedImageLiveUrl = awsConfig.S3_RESOURCE_LIVE_BASE_URL + "/" + awsConfig.VENIQA_CATALOG_IMAGE_BUCKET + "/" + detailedImageObjectKey;

                let detailedImageUploadUrl = awsConnections.s3.getSignedUrl('putObject', {
                    Bucket: awsConfig.VENIQA_CATALOG_IMAGE_BUCKET,
                    Key: detailedImageObjectKey,
                    ContentType: 'image/png',
                    Expires: awsConfig.PRESIGNED_URL_EXPIRES_IN
                });

                response.detailedImageUrls.push({
                    uploadUrl: detailedImageUploadUrl,
                    liveUrl: detailedImageLiveUrl
                })
            }

            // Generate the featured image urls and push it to the response object
            for (let index = 0; index < numberOfFeaturedImages; index++) {
                // If there is a previous file that can be replaced, use its name
                let filename = (product && product.featuredImageUrls[index]) ? product.featuredImageUrls[index].split('/')[6] : await cryptoGen.generateRandomToken();
                let objectKey = folderName + "/featured-images/" + filename;
                let objectLiveUrl = awsConfig.S3_RESOURCE_LIVE_BASE_URL + "/" + awsConfig.VENIQA_CATALOG_IMAGE_BUCKET + "/" + objectKey;

                let presignedUploadUrl = awsConnections.s3.getSignedUrl('putObject', {
                    Bucket: awsConfig.VENIQA_CATALOG_IMAGE_BUCKET,
                    Key: objectKey,
                    ContentType: 'image/png',
                    Expires: awsConfig.PRESIGNED_URL_EXPIRES_IN
                });

                response.featuredImageUrls.push({
                    uploadUrl: presignedUploadUrl,
                    liveUrl: objectLiveUrl
                })
            }

            // Get all the s3 keys associated with objects that need deletion
            // We are deleting keys only when presignedurl is requested for image updates, and the new requested count of images is lower than what has previously been saved.
            if (product) {
                let objectsToDelete = [];
                if (numberOfThumbnailAndDetailedImages < product.detailedImageUrls.length) {
                    for (let index = numberOfThumbnailAndDetailedImages; index < product.detailedImageUrls.length; index++) {
                        objectsToDelete.push(
                            { Key: folderName + '/thumbnails/' + product.thumbnailUrls[index].split('/')[6] },
                            { Key: folderName + "/detailed-images/" + product.detailedImageUrls[index].split('/')[6] }
                        )
                    }
                }
                if (numberOfFeaturedImages < product.featuredImageUrls.length) {
                    for (let index = numberOfFeaturedImages; index < product.featuredImageUrls.length; index++) {
                        objectsToDelete.push({
                            Key: folderName + "/featured-images/" + product.featuredImageUrls[index].split('/')[6]
                        })
                    }
                }

                if (objectsToDelete.length > 0) { 
                    // Delete the additional objects that exist other than the requested number
                    awsConnections.s3.deleteObjects({
                        Bucket: awsConfig.VENIQA_CATALOG_IMAGE_BUCKET,
                        Delete: {
                            Objects: objectsToDelete,
                            Quiet: false
                        }
                    }, (err, data) => {

                    })
                }
            }

            // Returm all the generated urls
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: response};
            return result;
        }
        catch(err) {
            console.log("Error in getPresignedUrlsForCatalogImageUploads Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}