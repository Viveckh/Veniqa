import express from 'express';
import passportAuth from '../authentication/passportAuth';
import catalogController from '../controllers/catalogController';
var router = express.Router();

/* GET Catalog Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Curated Catalog' });
});

router.post('/search', catalogController.searchCatalog);

router.post('/addProduct', catalogController.addProductToCatalog);

router.route('/getProductDetails').get(catalogController.getProductDetails);

router.put('/updateProduct', catalogController.updateProductInCatalog);

router.delete('/deleteProduct', catalogController.deleteProductFromCatalog);

router.get('/getPresignedUrlsForCatalogImageUploads', catalogController.getPresignedUrlsForCatalogImageUploads);

module.exports = router;