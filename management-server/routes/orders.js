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

router.post('/markItemAsFulfilling', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.markItemAsFulfilling);

router.post('/markItemAsShipped', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.markItemAsShipped);

router.post('/markItemAsDelivered', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.markItemAsDelivered);

router.put('/updateOrderFulfillmentDetails', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.updateOrderFulfillmentDetails);

router.put('/updateShipmentDetails', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.updateShipmentDetails);

router.put('/updateDeliveryDetails', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.updateDeliveryDetails);

router.post('/addComment', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.addComment);

router.put('/editComment', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.editComment);

router.delete('/deleteComment', passportAuth.isAuthenticated, passportAuth.canManageOrders, orderController.deleteComment);

module.exports = router;