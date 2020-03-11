import express from 'express';
import shoppingController from '../controllers/shoppingController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Shopping' });
});

router.use(passportAuth.isAuthenticated);

router.post('/addToCart', shoppingController.addToCart);

router.get('/getCart', shoppingController.getCart);

router.put('/updateCart', shoppingController.updateCart);

router.delete('/deleteFromCart', shoppingController.deleteFromCart);

module.exports = router;