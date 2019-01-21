import express from 'express';
import passportAuth from '../authentication/passportAuth';
import referenceDataController from '../controllers/referenceDataController';

var router = express.Router();


/* GET Reference Data Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Reference Data' });
});

router.get('/getCatalogBundle', passportAuth.isAuthenticated, referenceDataController.getCatalogBundle);

router.get('/getStores', passportAuth.isAuthenticated, referenceDataController.getStores);

router.get('/getRoles', passportAuth.isAuthenticated, referenceDataController.getRoles);

router.get('/getWeightUnits', passportAuth.isAuthenticated, referenceDataController.getWeightUnits);

router.get('/productCategoryList', passportAuth.isAuthenticated, passportAuth.canViewCatalog, referenceDataController.getProductCategoryList);

router.post('/productCategory', passportAuth.isAuthenticated, passportAuth.canManageCatalog, referenceDataController.addProductCategory);

router.get('/productCategory', passportAuth.isAuthenticated, passportAuth.canViewCatalog, referenceDataController.getProductCategory);

router.put('/productCategory', passportAuth.isAuthenticated, passportAuth.canManageCatalog, referenceDataController.updateProductCategory);

router.get('/tariffList', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, referenceDataController.getTariffList);

router.post('/tariff', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, referenceDataController.addTariffCategory);

router.get('/tariff', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, referenceDataController.getTariffCategory);

router.put('/tariff', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, referenceDataController.updateTariffCategory);

module.exports = router;