<template>
  <div id="single-list-item">
    <div class="general-padding">
      <b-row>
        <b-col md="6">
          {{data.product.brand}}
          <br>
          <strong>{{data.product.name}}</strong>
          <br>
          <a :href="data.product.item_url" target="_blank" style="color: blue">Product Url</a> |
          <a
            :href="'https://keen-turing-4cb6e4.netlify.com/#/products/'+ data.product._id"
            target="_blank"
            style="color: blue">
            Veniqa Url
          </a>
        </b-col>
        <b-col md="3">
          <span v-if="data.order_line_level_processing_details">
            <span class="item-status">{{data.order_line_level_processing_details.status}}</span>
          </span>
        </b-col>
        <b-col md="3">
          <div v-if="data.order_line_level_processing_details">
            <div class="align-right">
              <b-btn
                variant="primary"
                size="sm"
                v-if="data.order_line_level_processing_details.status == 'PROCESSING'
                && orderStatus != 'RECEIVED' && permissionGranted"
                @click="fulfillingModalShow = true"
              >Mark as fulfilling</b-btn>

              <b-btn
                variant="primary"
                size="sm"
                v-if="data.order_line_level_processing_details.status == 'FULFILLING'
                && orderStatus != 'RECEIVED' && permissionGranted"
                @click="shippingModalShow = true"
              >Mark as shipped</b-btn>

              <b-btn
                variant="primary"
                size="sm"
                v-if="data.order_line_level_processing_details.status == 'SHIPPED'
                && orderStatus != 'RECEIVED' && permissionGranted"
                @click="deliveredModalShow = true"
              >Mark as Delivered</b-btn>
            </div>
          </div>
        </b-col>
      </b-row>
      <p style="font-size: 1rem"></p>

      <b-row>
        <b-col sm="6">
          <strong>Total Count:</strong>
          {{data.counts}}
          <br>
          <strong>Aggregated Weight:</strong>
          {{data.aggregatedWeight.quantity}} {{data.aggregatedWeight.unit}}
          <br>
          <strong>Aggregated Price:</strong>
          $ {{data.aggregatedPrice.amount}}
          <br>
        </b-col>
        <b-col sm="6" v-if="data.order_line_level_processing_details">
          <strong>Store:</strong>
          {{data.product.store}}
          <br>
        </b-col>
      </b-row>
    </div>

    <div class="card">
      <div class="card-header align-center" id="headingOne">
        <h5 class="mb-0">
          <button
            class="btn btn-link"
            type="button"
            data-toggle="collapse"
            :data-target="'#item'+dataIndex"
            aria-expanded="true"
            :aria-controls="'item'+dataIndex"
          >View more details</button>
        </h5>
      </div>

      <div :id="'item'+dataIndex" class="collapse" aria-labelledby="headingOne">
        <div class="card-body">
          <item-order-description
            :item="data"
            :orderStatus="orderStatus"
            @edit="editButtonClicked"
          />
        </div>
      </div>
    </div>

    <fulfilling-modal
      v-if="fulfillingModalShow"
      :fulfillItem="data.order_line_level_processing_details ?
      data.order_line_level_processing_details.fulfillment_order_details : null"
      @cancel="closeModal()"
      :editMode="editMode"
      @fulfill="fulfillItemOrder"
    />

    <shipping-modal
      v-if="shippingModalShow"
      :shippingDetail="data.order_line_level_processing_details
      ? data.order_line_level_processing_details.shipment : null"
      @cancel="closeModal()"
      :editMode="editMode"
      @ship="markAsShipped"
    />

    <delivered-modal
      v-if="deliveredModalShow"
      @cancel="closeModal()"
      :deliveryDetail="data.order_line_level_processing_details
      ? data.order_line_level_processing_details.delivery : null"
      :editMode="editMode"
      @delivered="markAsDelivered"
    />
  </div>
</template>

<script>
import ItemOrderDescription from '@/components/orders/ItemOrderDescription.vue';
import FulfillingModal from '@/components/orders/FulfillingModal.vue';
import ShippingModal from '@/components/orders/ShippingModal.vue';
import DeliveredModal from '@/components/orders/DeliveredModal.vue';
import moment from 'moment';
import { mapGetters } from 'vuex';
import Permission from '@/constants/permissions';

export default {
  name: 'SingleListItem',
  props: {
    data: {
      required: true,
      type: Object,
    },

    dataIndex: {
      required: true,
      type: Number,
    },

    orderStatus: {
      required: true,
      type: String,
    },

    order: {
      required: true,
      type: Object,
    },
  },

  components: {
    ItemOrderDescription,
    FulfillingModal,
    ShippingModal,
    DeliveredModal,
  },

  data() {
    return {
      fulfillingModalShow: false,
      shippingModalShow: false,
      deliveredModalShow: false,
      editMode: false,
    };
  },

  methods: {
    closeModal() {
      this.fulfillingModalShow = false;
      this.shippingModalShow = false;
      this.deliveredModalShow = false;
      this.editMode = false;
    },
    editButtonClicked(value) {
      if (value === 'fulfillment') {
        this.fulfillingModalShow = true;
      } else if (value === 'shipment') {
        this.shippingModalShow = true;
      } else if (value === 'delivery') {
        this.deliveredModalShow = true;
      }
      this.editMode = true;
    },

    async markAsDelivered(deliveryDetail, editMode) {
      if (!deliveryDetail) return;
      deliveryDetail.orderId = this.order._id;
      deliveryDetail.cartItemId = this.data._id;

      deliveryDetail.deliveryDate = moment(
        deliveryDetail.deliveryDate,
      ).format();

      try {
        const isSuccess = await this.$store.dispatch(
          'orderStore/markAsDelivered',
          {
            deliveryDetail,
            editMode,
          },
        );
        if (isSuccess) {
          this.deliveredModalShow = false;
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'The item has been marked as shipped.',
          });
        }
      } catch (error) {
        console.log('Error', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'An error occured while trying to fulfill the order. Please try again later.',
        });
      }
    },
    async markAsShipped(shippingDetails, editMode) {
      if (!shippingDetails) return;

      shippingDetails.orderId = this.order._id;
      shippingDetails.cartItemId = this.data._id;

      try {
        const isSuccess = await this.$store.dispatch(
          'orderStore/markAsShipped',
          {
            shippingDetails,
            editMode,
          },
        );
        if (isSuccess) {
          this.closeModal();
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'The item has been marked as shipped.',
          });
        }
      } catch (error) {
        console.log('Error', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'An error occured while trying to fulfill the order. Please try again later.',
        });
      }
    },

    async fulfillItemOrder(fulfillDetails, editMode) {
      if (!fulfillDetails) return;
      fulfillDetails.cartItemId = this.data._id;
      fulfillDetails.orderId = this.order._id;

      try {
        let isSuccess = false;

        isSuccess = await this.$store.dispatch('orderStore/fulfillItem', {
          fulfillmentDetail: fulfillDetails,
          editMode,
        });

        if (isSuccess) {
          this.closeModal();
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'The item has been fulfilled.',
          });
        }
      } catch (error) {
        console.log('Error', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'An error occured while trying to fulfill the order. Please try again later.',
        });
      }
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
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/global.scss";

#single-list-item {
  .card {
    margin-top: 10px;
    border-radius: 0px;
  }
  .card-header {
    padding: 0px 0px;
    background: #343a40;
    border-radius: 0px;

    button {
      color: white !important;
    }
  }
}
</style>
