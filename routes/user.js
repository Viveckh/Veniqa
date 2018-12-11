import express from 'express';
import userController from '../controllers/userController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Users' });
});

router.post('/addNewAddress', passportAuth.isAuthenticated, userController.addNewAddress);

router.get('/getAddresses', passportAuth.isAuthenticated, userController.getAddresses);

router.put('/updateAddress', passportAuth.isAuthenticated, userController.updateAddress);

router.delete('/deleteAddress', passportAuth.isAuthenticated, userController.deleteAddress);

module.exports = router;