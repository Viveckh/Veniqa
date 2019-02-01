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
            :src="item.product.thumbnailUrls.length > 0 ? item.product.thumbnailUrls[0] : ''"
            alt
            class="item-img"
          >
        </b-col>
        <b-col md="7">
          <div>
            {{item.product.name}}
            <br>
            <br>

            <div class="info">
              <span class="info">Sold by: </span>
              <strong>{{item.product.store}}</strong>
              <p>
                <span class="info">Quantity:</span>
                <strong>{{item.counts}}</strong>
              </p>
            </div>
          </div>
        </b-col>
        <b-col md="3"></b-col>
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
    }
  },

  data() {
    return {

    }
  },
  
  filters: {
    formatDate(date){
      return moment(date).format("MMMM Do, YYYY");
    }
  },

  methods: {
    isDelivered(obj){
      return obj && obj.status === 'DELIVERED';
    }
  },

  computed: {
    itemStatusDeet() {
      return this.item.order_line_level_processing_details;
    }
  }
}
</script>

<style lang="scss">
#single-order-item {
  .item-img {
    width: 100%;
    height: auto;
  }
}
</style>
