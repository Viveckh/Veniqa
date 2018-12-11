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

router.get('/getProductCategories', passportAuth.isAuthenticated, referenceDataController.getProductCategories);

router.get('/getRoles', passportAuth.isAuthenticated, referenceDataController.getRoles);

router.get('/getWeightUnits', passportAuth.isAuthenticated, referenceDataController.getWeightUnits);

module.exports = router;