<template>
  <div id="single-list-item">
    <div class="general-padding">
      <b-row>
        <b-col md="6">
          {{data.product.brand}}
          <br>
          <strong>{{data.product.name}}</strong><br>
          <a :href="data.product.item_url" target="_blank" style="color: blue">Product Url</a> |
          <a :href="'https://www.google.com'" target="_blank" style="color: blue">Veniqa Url</a>

        </b-col>
        <b-col md="3">
          <span v-if="data.order_line_level_processing_details">
            Status:
            <span class="item-status">{{data.order_line_level_processing_details.status}}</span>
          </span>
        </b-col>
        <b-col md="3">
          <div v-if="data.order_line_level_processing_details">
            <div class="align-right">
              <b-btn
                v-if="data.order_line_level_processing_details.status == 'PROCESSING'"
              >Mark as fulfilling</b-btn>
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
          <item-order-description :item="data" :orderStatus="orderStatus"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemOrderDescription from '@/components/orders/ItemOrderDescription';

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
  },

  components: {
    ItemOrderDescription,
  },

  data() {
    return {};
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

  .item-status {
    padding: 3px 15px;
    border-radius: 15px;
    color: white;
    background-color: $primary-green;
  }
}
</style>
