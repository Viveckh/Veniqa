<template>
  <div id="single-order">
    <b-card header-tag="header" footer-tag="footer">
      <div slot="header" class="info">
        <b-row>
          <b-col>
            <div>
              <strong>Order #</strong> {{order._id}}
              <br>
              <strong>Order placed on</strong> {{order.auditLog.createdOn | formattedDate}}
            </div>
          </b-col>
          <b-col>
            <div class="align-right">
              <div>
                <!-- Status goes here -->
              Status:
              <span v-bind:class="{'green': order.overall_status != 'CANCELLED', 'red': order.overall_status === 'CANCELLED'}">
                <strong>{{order.overall_status}}</strong>
              </span>
              </div>
              <router-link :to="`/orders/${order._id}`">Order Details</router-link>
            </div>
          </b-col>
        </b-row>
      </div>

      <div class="order-body">
        <div v-for="(item, iind) in order.cart.items" v-bind:key="iind">
          <single-order-item :item="item"/>
          <hr v-if="iind != order.cart.items.length -1">
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import moment from 'moment';
import SingleOrderItem from '@/components/orders/SingleOrderItem.vue';

export default {
  name: 'SingleOrder',
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  components: {
    SingleOrderItem,
  },

  data() {
    return {

    };
  },

  filters: {
    formattedDate(date) {
      if (date) {
        return moment(date).format('MMMM Do, YYYY');
      }
      return '';
    },
  },


};
</script>

<style lang="scss">
#single-order{
  margin: 1.5rem 0rem;
}
</style>
