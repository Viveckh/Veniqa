<template>
  <div id="single-order-item">
    <!-- If the item is delivered, display when it was delivered -->
    <div v-if="isDelivered(itemStatusDeet)">
      <h6>
        <strong>Delivered on {{itemStatusDeet.delivery.delivery_date | formatDate}}</strong>
      </h6>
      <br>
    </div>

    <div class="item-desc">
      <b-row>
        <b-col md="2">
          <img
            :src="`${s3BucketUrl}/${item.product._id}`"
            alt
            class="item-img"
            crossorigin="anonymous"
          >
        </b-col>
        <b-col md="7">
          <div>
            {{item.product.name}}
            <br>
            <br>

            <div class="info">
              <strong>$ {{item.aggregatedPrice.amount}}</strong><br>
              <span class="info">Sold by: </span>&nbsp;&nbsp;
              <strong>{{item.product.store}}</strong>
              <p>
                <span class="info">Quantity:</span> &nbsp;&nbsp;
                <strong>{{item.counts}}</strong>
                <br>
                <!-- <span class="info">Aggregated Price:</span> &nbsp;&nbsp; -->

              </p>


              <div v-if="Object.keys(item.customizations).length > 0">
                <span class="info"><strong>Customizations</strong></span>
                <p v-for="(key, kind) in Object.keys(item.customizations)" v-bind:key="kind">
                  <span class="info">{{key}}</span> &nbsp;&nbsp;
                  <strong>{{item.customizations[key]}}</strong>
                </p>
              </div>
            </div>
          </div>
        </b-col>
        <b-col md="3">
          <div class="info">
            Due to the unconventional shipping methods, we cannot process direct returns on international orders.
            If there is any severe damage to the product, then please contact us. <br> <br>

            <a href="mailto:support@veniqa.com">support@veniqa.com</a>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'SingleOrderItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {

    };
  },

  filters: {
    formatDate(date) {
      return moment(date).format('MMMM Do, YYYY');
    },
  },

  methods: {
    isDelivered(obj) {
      return obj && obj.status === 'DELIVERED';
    },
  },

  computed: {
    itemStatusDeet() {
      return this.item.order_line_level_processing_details;
    },

    s3BucketUrl() {
      return process.env.VUE_APP_ORDER_S3_BUCKET_URL;
    },
  },
};
</script>

<style lang="scss">
#single-order-item {
  .item-img {
    width: 100%;
    height: auto;
  }
}
</style>
