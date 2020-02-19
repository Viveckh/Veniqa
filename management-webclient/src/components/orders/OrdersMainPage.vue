<template>
  <div class="general-padding" id="order-view">
    <h3>Orders</h3>

    <b-tabs>
      <template slot="tabs">
        <b-nav-item :active="orderStatus == 'RECEIVED'" @click="tabClicked('RECEIVED')">Received</b-nav-item>
        <b-nav-item :active="orderStatus == 'CONFIRMED'" @click="tabClicked('CONFIRMED')">Confirmed</b-nav-item>
        <b-nav-item
          :active="orderStatus == 'IN-PROGRESS'"
          @click="tabClicked('IN-PROGRESS')"
        >In Progress</b-nav-item>
        <b-nav-item :active="orderStatus == 'COMPLETED'" @click="tabClicked('COMPLETED')">Completed</b-nav-item>
        <b-nav-item :active="orderStatus == 'CANCELLED'" @click="tabClicked('CANCELLED')">Cancelled</b-nav-item>
      </template>
    </b-tabs>

    <div class="order-list">
      <order-list/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderList from '@/components/orders/OrderList.vue';

export default {
  name: 'OrdersMainPage',
  components: {
    OrderList,
  },
  data() {
    return {};
  },

  async created() {
    const status = this.orderStatus.trim().length === 0 ? 'RECEIVED' : this.orderStatus;

    this.$store.commit('orderStore/setOrderStatus', status);
    try {
      await this.$store.dispatch(
        'orderStore/getOrdersByStatus',
        status,
      );
    } catch (error) {
      this.$notify({
        group: 'all',
        type: 'error',
        text: `Error occured while getting orders with status: ${status}`,
      });
    }
  },

  methods: {
    tabClicked(tab) {
      this.$store.dispatch('orderStore/getOrdersByStatus', tab);
    },
  },

  computed: {
    ...mapGetters({
      orderStatus: 'orderStore/orderStatus',
    }),
  },
};
</script>

<style lang="scss" scoped>
#order-view {
  .order-list {
    padding: 20px 0px;
  }
}
</style>
