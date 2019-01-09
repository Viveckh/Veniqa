import express from 'express';
import orderController from '../controllers/orderController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

/* GET ORDERS Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Orders' });
});

router.post('/orderList', passportAuth.isAuthenticated, passportAuth.canViewOrders, orderController.getOrderList);

router.get('/order', passportAuth.isAuthenticated, passportAuth.canViewOrders, orderController.getOrderDetails);

//router.post('/confirmOrder', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.confirmOrder);

//router.post('/cancelOrder', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.cancelOrder);

module.exports = router;