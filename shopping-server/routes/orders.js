import express from 'express';
import orderController from '../controllers/orderController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET ORDERS Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Orders' });
});

router.use(passportAuth.isAuthenticated);

router.post('/createCheckout', orderController.createCheckout);

router.post('/completeCheckoutUsingCard', orderController.completeCheckoutUsingCard);

router.post('/completeCheckoutUsingKhalti', orderController.completeCheckoutUsingKhalti);

router.get('/isCheckoutValid', orderController.isCheckoutValid);

router.post('/createPaymentToken', orderController.createPaymentToken);

router.post('/completeCheckout', orderController.completeCheckout);

router.post('/stripePaymentInstant', orderController.stripePaymentInstant);

router.post('/completeCheckoutUsingStripePaymentInstant', orderController.completeCheckoutUsingStripePaymentInstant);

module.exports = router;