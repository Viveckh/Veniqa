import express from 'express';
import passportAuth from '../authentication/passportAuth';
import catalogController from '../controllers/catalogController';
var router = express.Router();

/* GET Catalog Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Curated Catalog' });
});

router.post('/search', catalogController.searchCatalog);

// GetProductDetails

router.put('/updateProduct', catalogController.updateProduct);

// AddProduct

// DeleteProduct

module.exports = router;