import express from 'express';
import userController from '../controllers/userController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Users' });
});

router.use(passportAuth.isAuthenticated);

router.post('/address', puserController.addNewAddress);

router.get('/address', puserController.getAddresses);

router.put('/address', puserController.updateAddress);

router.delete('/address', puserController.deleteAddress);

router.post('/orderList', puserController.getOrderList);

router.get('/orderDetails', puserController.getOrderDetails);

module.exports = router;