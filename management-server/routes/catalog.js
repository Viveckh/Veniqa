import express from 'express';
import passportAuth from '../authentication/passportAuth';
import catalogController from '../controllers/catalogController';
var router = express.Router();

/* GET Catalog Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Curated Catalog' });
});

router.post('/search', passportAuth.isAuthenticated, passportAuth.canViewCatalog, catalogController.searchCatalog);

router.post('/addProduct', passportAuth.isAuthenticated, passportAuth.canManageCatalog, catalogController.addProductToCatalog);

router.get('/getProductDetails', passportAuth.isAuthenticated, passportAuth.canViewCatalog, catalogController.getProductDetails);

router.put('/updateProduct', passportAuth.isAuthenticated, passportAuth.canManageCatalog, catalogController.updateProductInCatalog);

router.delete('/deleteProduct', passportAuth.isAuthenticated, passportAuth.canManageCatalog, catalogController.deleteProductFromCatalog);

router.get('/getPresignedUrlsForCatalogImageUploads', passportAuth.isAuthenticated, passportAuth.canManageCatalog, catalogController.getPresignedUrlsForCatalogImageUploads);

module.exports = router;