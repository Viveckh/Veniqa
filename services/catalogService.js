import Product from '../database/models/product';
import cryptoGen from '../authentication/cryptoGen';
import awsConnections from '../cloudservices/awsConnections';
import awsConfig from '../properties/aws-config';

export default {
    async searchCatalog(searchObj, pagingOptions) {
        // Preparing search filters
        let searchFilters = {}
        searchObj.store ? searchFilters.store = searchObj.store : '';
        searchObj.category ? searchFilters.category = searchObj.category : '';
        console.log("Search Filters", searchFilters)

        try {
            let products = await Product.paginate(searchFilters, {
                select: '_id name brand store price picture_urls category subcategory',
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
            console.log("[ERROR]: Catalog search failed => ", err)
            return err;
        }
    },

    async getProductDetails(productId) {
        let result = {};
        try {
            let product = await Product.findOne({_id: productId}).exec()
            if (product) {
                result = {status: "successful", responseData: product};
            } 
            else { 
                result = {status: "failed", errorDetails: "product not found"};
            }
            return result;  
        }
        catch(err) {
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateProduct(productObj) {
        try {
            // Store the id and delete it from the received object, to prevent any accidental replacement of id field
            let id = productObj._id;
            if (!id) {
                return "Missing product id";
            }
            delete productObj._id;
            
            // Make the update and return the updated document. Also run validators. Mongoose warns only limited validation takes place doing this in update
            let product = await Product.findOneAndUpdate({_id: id}, productObj, {runValidators: true, new: true}).exec();
            if (product) {
                return product;
            }
            return false;

        }
        catch(err) {
            console.log("[ERROR]: Product update failed => ", err)
            return err;
        }
    },

    async getPresignedUrlsForCatalogImageUploads(numberOfThumbnails, numberOfFeaturedImages, numberOfDetailedImages) {
        try {
            // Generate a random folder name to put contents
            let folderName = await cryptoGen.generateRandomToken();
            
            // Prepare the object which will contain the urls
            let response = {
                thumbnailUrls: [],
                featuredImageUrls: [],
                detailedImageUrls: [] 
            }

            // Generate the thumbnail urls and push it to the response object
            for (let index = 0; index < numberOfThumbnails; index++) {
                let objectKey = folderName + "/thumbnails/" + await cryptoGen.generateRandomToken();
                let objectLiveUrl = awsConfig.S3_RESOURCE_LIVE_BASE_URL + "/" + awsConfig.VENIQA_CATALOG_IMAGE_BUCKET + "/" + objectKey;

                let presignedUploadUrl = awsConnections.s3.getSignedUrl('putObject', {
                    Bucket: awsConfig.VENIQA_CATALOG_IMAGE_BUCKET,
                    Key: objectKey,
                    ContentType: 'image/png',
                    Expires: awsConfig.PRESIGNED_URL_EXPIRES_IN
                });

                response.thumbnailUrls.push({
                    uploadUrl: presignedUploadUrl,
                    liveUrl: objectLiveUrl
                })
            }

            // Generate the featured image urls and push it to the response object
            for (let index = 0; index < numberOfFeaturedImages; index++) {
                let objectKey = folderName + "/featured-images/" + await cryptoGen.generateRandomToken();
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

            // Generate the detailed image urls and push it to the response object
            for (let index = 0; index < numberOfDetailedImages; index++) {
                let objectKey = folderName + "/detailed-images/" + await cryptoGen.generateRandomToken();
                let objectLiveUrl = awsConfig.S3_RESOURCE_LIVE_BASE_URL + "/" + awsConfig.VENIQA_CATALOG_IMAGE_BUCKET + "/" + objectKey;

                let presignedUploadUrl = awsConnections.s3.getSignedUrl('putObject', {
                    Bucket: awsConfig.VENIQA_CATALOG_IMAGE_BUCKET,
                    Key: objectKey,
                    ContentType: 'image/png',
                    Expires: awsConfig.PRESIGNED_URL_EXPIRES_IN
                });

                response.detailedImageUrls.push({
                    uploadUrl: presignedUploadUrl,
                    liveUrl: objectLiveUrl
                })
            }

            // Returm all the generated urls
            return response;
        }
        catch(err) {
            console.log(err);
            return err;
        }
    }
}