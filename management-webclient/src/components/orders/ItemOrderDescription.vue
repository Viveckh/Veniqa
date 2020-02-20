<template>
  <div id="item-description">
    <b-row>
      <!-- Product Details starts here -->
      <b-col md="6">
        <h6>Product</h6>
        <hr>
        <!-- Only Products details -->
        <b-row>
          <b-col md="4">
            <strong>Name</strong>
            <br>
            <strong>Brand</strong>
            <br>
            <strong>Store</strong>
            <br>
            <strong>Category</strong>
            <br>
            <strong>Sub Category</strong>
            <br>
            <strong>Price</strong>
            <br>
            <strong>Weight</strong>
            <br>
          </b-col>
          <b-col md="8">
            {{item.product.name}}
            <br>
            {{item.product.brand}}
            <br>
            {{item.product.store}}
            <br>
            {{item.product.category.category}}
            <br>
            {{item.product.category.subcategory}}
            <br>
            $ {{item.product.price.amount}}
            <br>
            {{item.product.weight.quantity}} {{item.product.weight.unit}}
            <br>
          </b-col>
        </b-row>

        <div v-if="displayShipment">
          <b-row>
            <b-col md="6">
              <h6 class="header-margin-top">Shipment</h6>
            </b-col>
            <b-col md="6">
              <div class="align-right icon header-margin-top">
                <font-awesome-icon
                  v-b-tooltip.hover
                  title="Edit"
                  icon="edit"
                  v-if="permissionGranted"
                  @click="editClicked('shipment')"
                />
              </div>
            </b-col>
          </b-row>
          <hr>
          <b-row>
            <b-col md="4">
              <strong>Provider</strong>
              <br>
              <strong>Tracking Number</strong>
              <br>
              <strong>Service</strong>
              <br>
              <strong>Postage Paid</strong>
              <br><br>
              <strong>Created By</strong><br>
              <strong>Created On</strong><br>
              <strong>Updated By</strong><br>
              <strong>Updated On</strong><br>
            </b-col>
            <b-col md="8">
              {{shippingDetail.provider}}
              <br>
              {{shippingDetail.tracking_number}}
              <br>
              {{shippingDetail.service}}
              <br>
              $ {{parseFloat(shippingDetail.paid_postage.amount).toFixed(2)}}
              <br>
              <br>
              <a :href="`mailto:${shippingDetail.auditLog.createdBy.email}`">
                {{shippingDetail.auditLog.createdBy.name}}</a>
              <br>
              {{shippingDetail.auditLog.createdOn | formattedDate}}
              <br>
              <a :href="`mailto:${shippingDetail.auditLog.updatedBy.email}`">
                {{shippingDetail.auditLog.updatedBy.name}}</a>
              <br>
              {{shippingDetail.auditLog.updatedOn | formattedDate}}
              <br>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col md="6">
        <!-- Fulfillment Details -->
        <div v-if="displayFulfillmentOrder">
          <b-row>
            <b-col md="6">
              <h6>Fulfillment Details</h6>
            </b-col>
            <b-col md="6">
              <div class="align-right icon">
                <font-awesome-icon
                  v-b-tooltip.hover
                  title="Edit"
                  icon="edit"
                  v-if="permissionGranted"
                  @click="editClicked('fulfillment')"
                />
              </div>
            </b-col>
          </b-row>
          <hr>
          <b-row>
            <b-col md="4">
              <strong>Store</strong>
              <br>
              <strong>Order Number</strong>
              <br>
              <strong>Total Cost</strong>
              <br><br>
              <strong>Created By</strong><br>
              <strong>Created On</strong><br>
              <strong>Updated By</strong><br>
              <strong>Updated On</strong><br>
            </b-col>
            <b-col md="8">
              {{fulfillmentDetail.store}}
              <br>
              {{fulfillmentDetail.order_number}}
              <br>
              $ {{parseFloat(fulfillmentDetail.total_cost_price_of_item.amount).toFixed(2)}}
              <br>
              <br>
              <a :href="`mailto:${fulfillmentDetail.auditLog.createdBy.email}`">
                {{fulfillmentDetail.auditLog.createdBy.name}}</a>
              <br>
              {{fulfillmentDetail.auditLog.createdOn | formattedDate}}
              <br>
              <a :href="`mailto:${fulfillmentDetail.auditLog.updatedBy.email}`">
                {{fulfillmentDetail.auditLog.updatedBy.name}}</a>
              <br>
              {{fulfillmentDetail.auditLog.updatedOn | formattedDate}}
              <br>
              <br>
            </b-col>
          </b-row>
        </div>


        <div v-if="displayDelivery">
          <b-row>
            <b-col md="6">
              <h6 class="header-margin-top">Delivery</h6>
            </b-col>
            <b-col md="6">
              <div class="align-right icon header-margin-top">
                <font-awesome-icon
                  v-b-tooltip.hover
                  title="Edit"
                  icon="edit"
                  v-if="permissionGranted"
                  @click="editClicked('delivery')"
                />
              </div>
            </b-col>
          </b-row>
          <hr>
          <b-row>
            <b-col md="4">
              <strong>Delivered On</strong>
            </b-col>
            <b-col md="8">{{deliveryDetail.delivery_date | formattedDate}}</b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import Permission from '@/constants/permissions';

export default {
  name: 'ItemOrderDescription',
  props: {
    item: {
      required: true,
      type: Object,
    },

    orderStatus: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      DATE_FORMAT: 'dddd, MMMM Do YYYY, h:mm:ss a',
    };
  },

  filters: {
    formattedDate(dateString) {
      const obj = moment(dateString);
      const DATE_FORMAT = 'dddd, MMMM Do YYYY, h:mm:ss a';
      return obj.format(DATE_FORMAT);
    },
  },

  methods: {


    editClicked(status) {
      this.$emit('edit', status);
    },
  },

  computed: {
    ...mapGetters({
      permissions: 'authStore/permissions',
    }),

    permissionGranted() {
      if (this.permissions.indexOf(Permission.SUPERADMIN) >= 0) return true;
      return this.permissions && this.permissions.indexOf(Permission.ORDER_MANAGE) >= 0;
    },
    displayFulfillmentOrder() {
      if (!this.item.order_line_level_processing_details) return false;
      return (
        this.item.order_line_level_processing_details.status !== 'PROCESSING'
        && this.orderStatus !== 'RECEIVED'
      );
    },

    fulfillmentDetail() {
      return this.item.order_line_level_processing_details
        .fulfillment_order_details;
    },

    displayShipment() {
      if (!this.item.order_line_level_processing_details) return false;
      return (
        this.item.order_line_level_processing_details.status !== 'PROCESSING'
        && this.orderStatus !== 'RECEIVED'
        && this.item.order_line_level_processing_details.status !== 'FULFILLING'
      );
    },

    displayDelivery() {
      if (!this.item.order_line_level_processing_details) return false;
      return (
        this.item.order_line_level_processing_details.status === 'DELIVERED'
      );
    },

    shippingDetail() {
      return this.item.order_line_level_processing_details.shipment;
    },

    deliveryDetail() {
      return this.item.order_line_level_processing_details.delivery;
    },
  },
};
</script>

<style lang="scss" scoped>
#item-description {
  hr {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
