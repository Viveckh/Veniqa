import Order from '../database/models/order';
import orderStatuses from '../database/reference-data-files/order-statuses.json';
import httpStatus from 'http-status-codes';
import * as _ from 'lodash';
import logger from '../logging/logger';
import mongoose from 'mongoose';

export default {
    async getOrderList(orderStatus, pagingOptions, sortRule) {
        let orderFilters = {};
        if (orderStatus && orderStatuses.order_level.indexOf(orderStatus) > -1) {
            orderFilters['overall_status'] = orderStatus;
        }

        let result = {};
        try {
            let orders = await Order.paginate(orderFilters, {
                select: '_id overall_status user_email cart.totalWeight cart.items.product.name payment_info.amount_in_usd mailing_address.country mailing_address.state mailing_address.city',
                sort: sortRule,
                page: pagingOptions.page,
                limit: pagingOptions.limit
            }).then(result => {
                return result;
            }).catch(err => {
                return err;
            });
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: orders};
            return result;
        }
        catch(err) {
            logger.error("Error in getOrderList Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getOrderDetails(orderId){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).populate('cart.items.product.category cart.items.product.tariff').exec();
            if (order) {
                result = {httpStatus: httpStatus.OK, status: "successful", responseData: order};
            } 
            else { 
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;  
        }
        catch(err) {
            logger.error("Error in getOrderDetails Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async confirmOrder(orderId, userObj){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status is not in received state, order cannot/or does not need to be confirmed
            if (order.overall_status != 'RECEIVED'){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders in received state can be confirmed"};
                return result;
            }

            // TODO: PROCESS THE PAYMENT HERE

            // Updating order level status
            order.overall_status = "CONFIRMED";

            // Updating order line level status
            for (let item of order.cart.items) {
                item['order_line_level_processing_details'] = {
                    status: 'PROCESSING'
                }
            }

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in confirmOrder Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async cancelOrder(orderId, userObj){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status is not in received state, order cannot/or does not need to be confirmed
            if (order.overall_status != 'RECEIVED'){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that aren't confirmed can be cancelled"};
                return result;
            }

            // TODO: REFUND THE PAYMENT HERE
            
            // Updating order level status
            order.overall_status = "CANCELLED";

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in cancelOrder Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async markItemAsFulfilling(orderId, cartItemId, store, orderNumber, totalCostPriceOfItemInUSD, userObj){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status of order is not in confirmed or in-progress state, items within its cart shall not be fulfilled
            if (!["CONFIRMED", "IN-PROGRESS"].includes(order.overall_status)){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that are confirmed or in-progress can be fulfilled"};
                return result;
            }

            // Find the corresponding item in the order that needs to be marked fulfilling
            let index = _.findIndex(order.cart.items, {_id: mongoose.Types.ObjectId(cartItemId)});

            // If the cart item was not found, return a failure response
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Only items that are currently in processing can be fulfilled
            if(!(order.cart.items[index].order_line_level_processing_details && order.cart.items[index].order_line_level_processing_details.status == 'PROCESSING')) {
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only order items that are currently in processing can be marked for fulfilling"};
                return result;
            }

            //Otherwise, go ahead and populate the fulfillment detail node
            let auditor = { email: userObj.email, name: userObj.name }
            order.cart.items[index].order_line_level_processing_details['fulfillment_order_details'] = {
                store: store,
                order_number: orderNumber,
                total_cost_price_of_item: {amount: totalCostPriceOfItemInUSD, currency: 'USD'},
                auditLog: {
                    createdBy: auditor,
                    createdOn: new Date(),
                    updatedBy: auditor,
                    updatedOn: new Date()
                }
            }
            
            // Updating order level and line item status
            // If it has gotten here in terms of execution, it is because we just got into or currently are in the in-progress stage of this order
            order.cart.items[index].order_line_level_processing_details.status = "FULFILLING";
            order.overall_status = "IN-PROGRESS";

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in markItemAsFulfilling Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async markItemAsShipped(orderId, cartItemId, provider, trackingNumber, service, paidPostageInUSD, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status of order is not in confirmed or in-progress state, items within its cart shall not be shipped
            if (!["CONFIRMED", "IN-PROGRESS"].includes(order.overall_status)){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that are confirmed or in-progress can be shipped"};
                return result;
            }

            // Find the corresponding item in the order that needs to be marked as shipped 
            let index = _.findIndex(order.cart.items, {_id: mongoose.Types.ObjectId(cartItemId)});

            // If the cart item was not found, return a failure response
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Only items that are currently in fulfilling stage can be shipped
            if(!(order.cart.items[index].order_line_level_processing_details && order.cart.items[index].order_line_level_processing_details.status == 'FULFILLING')) {
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only order items that are currently being fulfilled can be marked as shipped"};
                return result;
            }

            //Otherwise, go ahead and populate the shipment detail node
            let auditor = { email: userObj.email, name: userObj.name }
            order.cart.items[index].order_line_level_processing_details['shipment'] = {
                provider: provider,
                tracking_number: trackingNumber,
                service: service,
                paid_postage: {amount: paidPostageInUSD, currency: 'USD'},
                auditLog: {
                    createdBy: auditor,
                    createdOn: new Date(),
                    updatedBy: auditor,
                    updatedOn: new Date()
                }
            }
            
            // This doesn't change order level status, so no need to worry about it. Change the line item status though
            order.cart.items[index].order_line_level_processing_details.status = "SHIPPED";

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in markItemAsShipped Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async markItemAsDelivered(orderId, cartItemId, deliveryDate, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status of order is not in confirmed or in-progress state, items within its cart shall not be shipped or delivered
            if (!["CONFIRMED", "IN-PROGRESS"].includes(order.overall_status)){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that are confirmed or in-progress can be shipped or delivered"};
                return result;
            }

            // Find the corresponding item in the order that needs to be marked as shipped 
            let index = _.findIndex(order.cart.items, {_id: mongoose.Types.ObjectId(cartItemId)});

            // If the cart item was not found, return a failure response
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Only items that are currently in shipped stage can be delivered
            if(!(order.cart.items[index].order_line_level_processing_details && order.cart.items[index].order_line_level_processing_details.status == 'SHIPPED')) {
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only order items that are currently being shipped can be marked as delivered"};
                return result;
            }

            //Otherwise, go ahead and populate the delivery detail node
            let auditor = { email: userObj.email, name: userObj.name }
            order.cart.items[index].order_line_level_processing_details['delivery'] = {
                delivery_date: deliveryDate,
                auditLog: {
                    createdBy: auditor,
                    createdOn: new Date(),
                    updatedBy: auditor,
                    updatedOn: new Date()
                }
            }
            
            // Updating order line level status
            // If this is also the last delivery item for the order, mark the overall order status as completed. 
            order.cart.items[index].order_line_level_processing_details.status = "DELIVERED";
            if(_.every(order.cart.items, (item) => { return item.order_line_level_processing_details.status == "DELIVERED"})) {
                order.overall_status = "COMPLETED";
            }

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in markItemAsDelivered Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateOrderFulfillmentDetails(orderId, cartItemId, store, orderNumber, totalCostPriceOfItemInUSD, userObj) {
        let result = {};
        try {
            // If nothing is there to update, return the call here
            if (!(store || orderNumber || totalCostPriceOfItemInUSD)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Nothing has been sent for update"};
                return result;
            }

            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status of order is not at least in in-progress state, you should not be able to proceed
            if (!["IN-PROGRESS", "COMPLETED", "CANCELLED"].includes(order.overall_status)){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that are at least in-progress and items marked as fulfilling can be updated"};
                return result;
            }

            // Find the corresponding item in the order that needs to be updated
            let index = _.findIndex(order.cart.items, {_id: mongoose.Types.ObjectId(cartItemId)});

            // If the cart item was not found, return a failure response
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Only items that already have a fulfillment details node can be updated
            if(!(order.cart.items[index].order_line_level_processing_details && order.cart.items[index].order_line_level_processing_details.fulfillment_order_details)) {
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only order items that already have a fulfillment details node can be updated"};
                return result;
            }

            //Otherwise, go ahead and update the fulfillment detail node
            let auditor = { email: userObj.email, name: userObj.name }
            store ? order.cart.items[index].order_line_level_processing_details.fulfillment_order_details.store = store : '';
            orderNumber ? order.cart.items[index].order_line_level_processing_details.fulfillment_order_details.order_number = orderNumber : '';
            totalCostPriceOfItemInUSD ? order.cart.items[index].order_line_level_processing_details.fulfillment_order_details.total_cost_price_of_item.amount = totalCostPriceOfItemInUSD : '';  
            order.cart.items[index].order_line_level_processing_details.fulfillment_order_details.auditLog.updatedBy = auditor;
            order.cart.items[index].order_line_level_processing_details.fulfillment_order_details.auditLog.updatedOn = new Date();

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in updateOrderFulfillmentDetails Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateShipmentDetails(orderId, cartItemId, provider, trackingNumber, service, paidPostageInUSD, userObj) {
        let result = {};
        try {
            // If nothing is there to update, return the call here
            if (!(provider || trackingNumber || service || paidPostageInUSD)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Nothing has been sent for update"};
                return result;
            }

            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status of order is not at least in in-progress state, you should not be able to proceed
            if (!["IN-PROGRESS", "COMPLETED", "CANCELLED"].includes(order.overall_status)){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that are at least in-progress and items marked as shipped can be updated"};
                return result;
            }

            // Find the corresponding item in the order that needs to be updated
            let index = _.findIndex(order.cart.items, {_id: mongoose.Types.ObjectId(cartItemId)});

            // If the cart item was not found, return a failure response
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Only items that already have a shipment node can be updated
            if(!(order.cart.items[index].order_line_level_processing_details && order.cart.items[index].order_line_level_processing_details.shipment)) {
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only order items that already have a shipment node can be updated"};
                return result;
            }

            //Otherwise, go ahead and populate the shipment detail node
            let auditor = { email: userObj.email, name: userObj.name }
            provider ? order.cart.items[index].order_line_level_processing_details.shipment.provider = provider : '';
            trackingNumber ? order.cart.items[index].order_line_level_processing_details.shipment.tracking_number = trackingNumber : '';
            service ? order.cart.items[index].order_line_level_processing_details.shipment.service = service : '';
            paidPostageInUSD ? order.cart.items[index].order_line_level_processing_details.shipment.paid_postage.amount = paidPostageInUSD : '';
            order.cart.items[index].order_line_level_processing_details.shipment.auditLog.updatedBy = auditor;
            order.cart.items[index].order_line_level_processing_details.shipment.auditLog.updatedOn = new Date();

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in updateShipmentDetails Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateDeliveryDetails(orderId, cartItemId, deliveryDate, userObj) {
        let result = {};
        try {
            // If nothing is there to update, return the call here
            if (!(deliveryDate)) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: "Nothing has been sent for update"};
                return result;
            }

            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // If the overall status of order is not at least in in-progress state, you should not be able to proceed
            if (!["IN-PROGRESS", "COMPLETED", "CANCELLED"].includes(order.overall_status)){
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that are at least in-progress and items marked as delivered can be updated"};
                return result;
            }

            // Find the corresponding item in the order that needs to be updated
            let index = _.findIndex(order.cart.items, {_id: mongoose.Types.ObjectId(cartItemId)});

            // If the cart item was not found, return a failure response
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Only items that already have a delivery node can be updated
            if(!(order.cart.items[index].order_line_level_processing_details && order.cart.items[index].order_line_level_processing_details.delivery)) {
                result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only order items that already have a delivery node can be updated"};
                return result;
            }

            //Otherwise, go ahead and populate the delivery detail node
            let auditor = { email: userObj.email, name: userObj.name }
            deliveryDate ? order.cart.items[index].order_line_level_processing_details.delivery.delivery_date = deliveryDate : '';
            order.cart.items[index].order_line_level_processing_details.delivery.auditLog.updatedBy = auditor;
            order.cart.items[index].order_line_level_processing_details.delivery.auditLog.updatedOn = new Date();

            // Updating order level audit log
            order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
            order.auditLog.updatedOn = new Date();

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in updateDeliveryDetails Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async addComment(orderId, comment, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!order) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Initialize comments node if it doesn't exist yet
            order.comments ? '': (order.comments = []); 

            let auditor = { email: userObj.email, name: userObj.name }
            // Adding the comment
            order.comments.push({
                content: comment,
                auditLog: {
                    createdBy: auditor,
                    createdOn: new Date(),
                    updatedBy: auditor,
                    updatedOn: new Date()
                }
            })

            // No need to update order level audit log since comments don't necessarily constitute core order details

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order.comments} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
            return result;
        }
        catch(err) {
            logger.error("Error in addComment Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async editComment(orderId, commentId, editedComment, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!(order && order.comments)) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }

            // Finding the comment
            let index = _.findIndex(order.comments, {_id: mongoose.Types.ObjectId(commentId)});

            // If the comment is not found, return a failed status
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }
            
            // If the comment does not belong to the user who's requesting the action, return another failed status
            if (order.comments[index].auditLog.createdBy.email != userObj.email) {
                result = {httpStatus: httpStatus.FORBIDDEN, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.FORBIDDEN)};
                return result;
            }

            // If all is good, go ahead and perform the update
            order.comments[index].content = editedComment,
            order.comments[index].auditLog.updatedBy = { email: userObj.email, name: userObj.name },
            order.comments[index].auditLog.updatedOn = new Date();

            // No need to update order level audit log since comments don't necessarily constitute core order details

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order.comments} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
        
            return result;
        }
        catch(err) {
            logger.error("Error in editComment Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteComment(orderId, commentId, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            // If no matching orders are found, return a failure response
            if (!(order && order.comments)) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }
 
            // Finding the comment
            let index = _.findIndex(order.comments, {_id: mongoose.Types.ObjectId(commentId)});

            // If the comment is not found, return a failed status
            if (index == -1) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }
            
            // If the comment does not belong to the user who's requesting the action, return another failed status
            if (order.comments[index].auditLog.createdBy.email != userObj.email) {
                result = {httpStatus: httpStatus.FORBIDDEN, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.FORBIDDEN)};
                return result;
            }

            // If all is good, go ahead and perform the deletion
            order.comments.splice(index, 1);

            // No need to update order level audit log since comments don't necessarily constitute core order details

            // Saving all changes
            order = await order.save();
            result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order.comments} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
        
            return result;
        }
        catch(err) {
            logger.error("Error in deleteComment Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}