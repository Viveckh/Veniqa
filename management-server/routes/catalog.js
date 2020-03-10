import express from 'express';
import passportAuth from '../authentication/passportAuth';
import catalogController from '../controllers/catalogController';
var router = express.Router();

/* GET Catalog Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Curated Catalog' });
});

router.use(passportAuth.isAuthenticated);

router.post('/search', passportAuth.canViewCatalog, catalogController.searchCatalog);

router.post('/addProduct', passportAuth.canManageCatalog, catalogController.addProductToCatalog);

router.get('/getProductDetails', passportAuth.canViewCatalog, catalogController.getProductDetails);

router.put('/updateProduct', passportAuth.canManageCatalog, catalogController.updateProductInCatalog);

router.delete('/deleteProduct', passportAuth.canManageCatalog, catalogController.deleteProductFromCatalog);

router.get('/getPresignedUrlsForCatalogImageUploads', passportAuth.canManageCatalog, catalogController.getPresignedUrlsForCatalogImageUploads);

module.exports = router;