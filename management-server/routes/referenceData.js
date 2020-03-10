import express from 'express';
import passportAuth from '../authentication/passportAuth';
import referenceDataController from '../controllers/referenceDataController';

var router = express.Router();


/* GET Reference Data Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Reference Data' });
});

router.use(passportAuth.isAuthenticated);

router.get('/getCatalogBundle', referenceDataController.getCatalogBundle);

router.get('/getStores', referenceDataController.getStores);

router.get('/getRoles', referenceDataController.getRoles);

router.get('/getWeightUnits', referenceDataController.getWeightUnits);

router.get('/productCategoryList', passportAuth.canViewCategories, referenceDataController.getProductCategoryList);

router.post('/productCategory', passportAuth.canManageCategories, referenceDataController.addProductCategory);

router.get('/productCategory', passportAuth.canViewCategories, referenceDataController.getProductCategory);

router.put('/productCategory', passportAuth.canManageCategories, referenceDataController.updateProductCategory);

router.get('/tariffList', passportAuth.canViewTariff, referenceDataController.getTariffList);

router.post('/tariff', passportAuth.canManageTariff, referenceDataController.addTariffCategory);

router.get('/tariff', passportAuth.canViewTariff, referenceDataController.getTariffCategory);

router.put('/tariff', passportAuth.canManageTariff, referenceDataController.updateTariffCategory);

module.exports = router;