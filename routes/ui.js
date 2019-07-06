import express from 'express';
import passportAuth from '../authentication/passportAuth';
import uiController from '../controllers/uiController.js';
var router = express.Router();

/* GET UI Customziations Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa User Interface Customizations' });
});

router.get('/featured', uiController.getFeaturedSection);

router.get('/productCategoryList', uiController.getProductCategoryList);

module.exports = router;