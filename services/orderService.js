import Order from '../database/models/order';
import orderStatuses from '../database/reference-data-files/order-statuses.json';
import httpStatus from 'http-status-codes';
import * as _ from 'lodash';
import mongoose from 'mongoose';

export default {
    async getOrderList(orderStatus, pagingOptions) {
        let orderFilters = {};
        if (orderStatus && orderStatuses.order_level.indexOf(orderStatus) > -1) {
            orderFilters['overall_status'] = orderStatus;
        }

        let result = {};
        try {
            let orders = await Order.paginate(orderFilters, {
                select: '_id overall_status user_email cart.totalWeight cart.items.product.name payment_info.amount_in_usd mailing_address.country mailing_address.state mailing_address.city',
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
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async getOrderDetails(orderId){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();
            if (order) {
                result = {httpStatus: httpStatus.OK, status: "successful", responseData: order};
            } 
            else { 
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;  
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async confirmOrder(orderId, userObj){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            if (order) {
                if (order.overall_status == 'RECEIVED'){
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
                }
                else {
                    result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders in received state can be confirmed"};
                }
            }
            else {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async cancelOrder(orderId, userObj){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            if (order) {
                if (order.overall_status == 'RECEIVED'){
                    // TODO: REFUND THE PAYMENT HERE
                    order.overall_status = "CANCELLED";

                    // Updating order level audit log
                    order.auditLog.updatedBy = {email: userObj.email, name: userObj.name}
                    order.auditLog.updatedOn = new Date();

                    // Saving all changes
                    order = await order.save();
                    result = order ? {httpStatus: httpStatus.OK, status: "successful", responseData: order} : {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                }
                else {
                    result = {httpStatus: httpStatus.METHOD_NOT_ALLOWED, status: "failed", errorDetails: "only orders that aren't confirmed yet can be cancelled"};
                }
            }
            else {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async addComment(orderId, comment, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            if (order) {
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
            }
            else {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async editComment(orderId, commentId, editedComment, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            if (order && order.comments) { 
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
            }
            else {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async deleteComment(orderId, commentId, userObj) {
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            if (order && order.comments) { 
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
            }
            else {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
            }
            return result;
        }
        catch(err) {
            console.log(err);
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async updateOrderDetails(orderId, orderStatus){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();

            /*
            if (orderStatus == 'CONFIRMED'){
                // TODO: PROCESS THE PAYMENT HERE

            }
            else if (orderStatus == )
            */
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    }
}