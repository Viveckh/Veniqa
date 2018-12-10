import express from 'express';
import passportAuth from '../authentication/passportAuth';
import referenceDataController from '../controllers/referenceDataController';

var router = express.Router();


/* GET Reference Data Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Reference Data' });
});

router.get('/getStores', referenceDataController.getStores);

router.get('/getProductCategories', referenceDataController.getProductCategories);

router.get('/getRoles', referenceDataController.getRoles);

router.get('/getWeightUnits', referenceDataController.getWeightUnits);

module.exports = router;