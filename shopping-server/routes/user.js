import express from 'express';
import userController from '../controllers/userController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Users' });
});

router.use(passportAuth.isAuthenticated);

router.post('/address', userController.addNewAddress);

router.get('/address', userController.getAddresses);

router.put('/address', userController.updateAddress);

router.delete('/address', userController.deleteAddress);

router.post('/orderList', userController.getOrderList);

router.get('/orderDetails', userController.getOrderDetails);

module.exports = router;