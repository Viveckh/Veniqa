<template>
  <div id="order-list">
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Order Status</th>
          <th>Total Weight</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, orderId) in orders" v-bind:key="orderId" class="list-padding">
          <td>{{order._id}}</td>
          <td>{{order.overall_status}}</td>
          <td>{{order.cart.totalWeight.quantity}} {{order.cart.totalWeight.unit}}</td>
          <td>$ {{paymentInfo(order.payment_info)}}</td>
          <td>
            <b-btn variant="success" size="sm" @click="openOrder(order)">Open</b-btn>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OrderList',
  data() {
    return {

    };
  },

  methods: {
    paymentInfo(array) {
      if (array.length > 0) {
        const obj = array[0];
        return obj.amount_in_usd.amount;
      }

      return '';
    },

    async openOrder(order) {
      try {
        const isSuccess = await this.$store.dispatch('orderStore/openOrderDetail', order);
        if (!isSuccess) {
          throw new Error('Failed');
        } else {
          this.$router.push('orders/orderdetail');
        }
      } catch (error) {
        console.log('Error occured', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'The Order could not be opened at the moment. Server guys are working on it.',
        });
      }
    },
  },

  computed: {
    ...mapGetters({
      orders: 'orderStore/orders',
    }),
  },
};
</script>

<style lang="scss" scoped>
.list-padding{
  td{
    padding: 0.3rem;
    padding-top: 10px;
  }
}
</style>
