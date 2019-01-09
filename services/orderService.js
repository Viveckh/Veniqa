import Order from '../database/models/order';
import ORDER_STATUSES from '../database/reference-data-files/order-statuses.json';

export default {
    async getOrderList(orderStatus, pagingOptions) {
        let orderFilters = {};
        if (orderStatus && ORDER_STATUSES.indexOf(orderStatus) > -1) {
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
            result = {status: "successful", responseData: orders};
            return result;
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
            return result;
        }
    },

    async getOrderDetails(orderId){
        let result = {};
        try {
            let order = await Order.findOne({_id: orderId}).exec();
            if (order) {
                result = {status: "successful", responseData: order};
            } 
            else { 
                result = {status: "failed", errorDetails: "order not found"};
            }
            return result;  
        }
        catch(err) {
            console.log(err);
            result = {status: "failed", errorDetails: err};
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