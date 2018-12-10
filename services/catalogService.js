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
                select: '_id name brand store price thumbnailUrls category subcategory',
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

    async addProductToCatalog(productObj){
        let result = {};
        try {
            let product = new Product(productObj);
            product = await product.save();

            if (product){
                result = {status: "successful", responseData: product};
            }
            else {
                result = {status: "failed", errorDetails: "could not add product"};
            }
            return result;
        }
        catch(err) {
            result = {status: "failed", errorDetails: err};
            return result;
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

    async updateProductInCatalog(productObj) {
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

    async deleteProductFromCatalog(productId){
        let result = {};
        try {
            // Remove the product
            let product = await Product.remove({_id: productId}).exec();
            
            // We are not deleting the images associated with the product from S3, because those links will be referenced in order tables if the product was previously ordered

            if (product){
                result = {status: "successful", responseData: product};
            }
            else {
                result = {status: "failed", errorDetails: "could not remove product"};
            }
            return result;
        }
        catch(err) {
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async getPresignedUrlsForCatalogImageUploads(productId, numberOfThumbnails, numberOfFeaturedImages, numberOfDetailedImages) {
        try {
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
                featuredImageUrls: [],
                detailedImageUrls: []
            }

            // Generate the thumbnail urls and push it to the response object
            for (let index = 0; index < numberOfThumbnails; index++) {
                // If there is a previous file that can be replaced, use its name
                let filename = (product && product.thumbnailUrls[index]) ? product.thumbnailUrls[index].split('/')[6] : await cryptoGen.generateRandomToken();
                let objectKey = folderName + "/thumbnails/" + filename;
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

            // Generate the detailed image urls and push it to the response object
            for (let index = 0; index < numberOfDetailedImages; index++) {
                // If there is a previous file that can be replaced, use its name
                let filename = (product && product.detailedImageUrls[index]) ? product.detailedImageUrls[index].split('/')[6] : await cryptoGen.generateRandomToken();
                let objectKey = folderName + "/detailed-images/" + filename;
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

            // Get all the s3 keys associated with objects that need deletion
            // We are deleting keys only when presignedurl is requested for image updates, and the new requested count of images is lower than what has previously been saved.
            if (product) {
                let objectsToDelete = [];
                if (numberOfThumbnails < product.thumbnailUrls.length) {
                    for (let index = numberOfThumbnails; index < product.thumbnailUrls.length; index++) {
                        objectsToDelete.push({
                            Key: folderName + '/thumbnails/' + product.thumbnailUrls[index].split('/')[6]
                        })
                    }
                }
                if (numberOfFeaturedImages < product.featuredImageUrls.length) {
                    for (let index = numberOfFeaturedImages; index < product.featuredImageUrls.length; index++) {
                        objectsToDelete.push({
                            Key: folderName + "/featured-images/" + product.featuredImageUrls[index].split('/')[6]
                        })
                    }
                }
                if (numberOfDetailedImages < product.detailedImageUrls.length) {
                    for (let index = numberOfDetailedImages; index < product.detailedImageUrls.length; index++) {
                        objectsToDelete.push({
                            Key: folderName + "/detailed-images/" + product.detailedImageUrls[index].split('/')[6]
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
            return response;
        }
        catch(err) {
            console.log(err);
            return err;
        }
    }
}