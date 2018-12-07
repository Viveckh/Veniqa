import express from 'express';
import passportAuth from '../authentication/passportAuth';
import catalogController from '../controllers/catalogController';
var router = express.Router();

/* GET Catalog Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Curated Catalog' });
});

router.route('/search').post(catalogController.searchCatalog)

router.route('/getProductDetails').get(catalogController.getProductDetails);

module.exports = router;