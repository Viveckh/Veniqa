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

router.post('/confirmOrder', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.confirmOrder);

router.post('/cancelOrder', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.cancelOrder);

router.post('/addComment', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.addComment);

router.put('/editComment', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.editComment);

router.delete('/deleteComment', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.deleteComment);

module.exports = router;