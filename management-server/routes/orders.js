import express from 'express';
import orderController from '../controllers/orderController';
import passportAuth from '../authentication/passportAuth';
var router = express.Router();

router.use(passportAuth.isAuthenticated);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Orders' });
});

router.post('/orderList', passportAuth.canViewOrders, orderController.getOrderList);

router.get('/order', passportAuth.canViewOrders, orderController.getOrderDetails);

router.post('/confirmOrder', passportAuth.canManageOrders, orderController.confirmOrder);

router.post('/cancelOrder', passportAuth.canManageOrders, orderController.cancelOrder);

router.post('/markItemAsFulfilling', passportAuth.canManageOrders, orderController.markItemAsFulfilling);

router.post('/markItemAsShipped', passportAuth.canManageOrders, orderController.markItemAsShipped);

router.post('/markItemAsDelivered', passportAuth.canManageOrders, orderController.markItemAsDelivered);

router.put('/updateOrderFulfillmentDetails', passportAuth.canManageOrders, orderController.updateOrderFulfillmentDetails);

router.put('/updateShipmentDetails', passportAuth.canManageOrders, orderController.updateShipmentDetails);

router.put('/updateDeliveryDetails', passportAuth.canManageOrders, orderController.updateDeliveryDetails);

router.post('/addComment', passportAuth.canManageOrders, orderController.addComment);

router.put('/editComment', passportAuth.canManageOrders, orderController.editComment);

router.delete('/deleteComment', passportAuth.canManageOrders, orderController.deleteComment);

module.exports = router;