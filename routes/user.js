import express from 'express';
import userController from '../controllers/userController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Users' });
});

router.post('/address', passportAuth.isAuthenticated, userController.addNewAddress);

router.get('/address', passportAuth.isAuthenticated, userController.getAddresses);

router.put('/address', passportAuth.isAuthenticated, userController.updateAddress);

router.delete('/address', passportAuth.isAuthenticated, userController.deleteAddress);

router.post('/orderList', passportAuth.isAuthenticated, userController.getOrderList);

router.get('/orderDetails', passportAuth.isAuthenticated, userController.getOrderDetails);

module.exports = router;