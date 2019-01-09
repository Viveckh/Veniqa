import mongoose from 'mongoose';
import validator from 'validator';

import auditLogSchema from './auditLog';
import fulfillmentOrderLineLevelSchema from './fulfillmentOrderLineLevel';
import shipmentSchema from './shipment';

import ORDER_STATUSES from '../reference-data-files/order-statuses.json';

let orderLineLevelProcessingSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ORDER_STATUSES.order_line_level,
        required: true
    },
    fulfillment_order_details: {
        type: fulfillmentOrderLineLevelSchema,
        required: function() {
            return this.status == 'FULFILLING';
        }
    },
    shipment: {
        type: shipmentSchema,
        required: function() {
            return this.status == 'SHIPPED';
        }
    },
    delivery: {
        type: auditLogSchema,
        required: function(){
            return this.status == 'DELIVERED';
        }
    }
});

module.exports = orderLineLevelProcessingSchema;
