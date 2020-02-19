<template>
  <div id="order-view" class="align-left">
    <div class="space"></div>
    &nbsp;
    <h2>Your orders</h2>

    <b-tabs>
      <template slot="tabs">
        <b-nav-item
          v-for="(item, ind) in tabs"
          v-bind:key="ind"
          :active="activeTab === item.key"
          @click="tabSelected(item.key)"
        >{{item.name}}</b-nav-item>
      </template>
    </b-tabs>

    <div class="order-list">
      <div v-for="(order, oid) in filteredOrders" v-bind:key="oid">
        <single-order :order="order"/>
      </div>

      <div v-if="filteredOrders.length <= 0" class="empty-info">
        <p>No orders are in this status.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SingleOrder from '@/components/orders/SingleOrder.vue';

export default {
  name: 'OrderView',
  components: {
    SingleOrder,
  },
  data() {
    return {
      tabs: [
        {
          name: 'Orders',
          key: 'all',
        },
        {
          name: 'Open Orders',
          key: 'open',
        },
        {
          name: 'Completed',
          key: 'completed',
        },
        {
          name: 'Cancelled',
          key: 'cancelled',
        },
      ],

      activeTab: 'all',
    };
  },

  async created() {
    // Look for all the items from the order list.
    await this.$store.dispatch('orderStore/getOrderList', '');
  },

  methods: {
    tabSelected(key) {
      this.activeTab = key;
    },
  },

  computed: {
    ...mapGetters({
      orders: 'orderStore/orders',
    }),

    filteredOrders() {
      if (this.activeTab === 'open') {
        return _.filter(this.orders, i => i.overall_status !== 'COMPLETED' && i.overall_status !== 'CANCELLED');
      }
      if (this.activeTab === 'completed') {
        return _.filter(this.orders, i => i.overall_status === 'COMPLETED');
      }
      if (this.activeTab === 'cancelled') {
        return _.filter(this.orders, i => i.overall_status === 'CANCELLED');
      }

      return this.orders;
    },
  },
};
</script>

<style lang="scss">
#order-view {
  min-height: 90vh;
  width: 70%;
  margin: auto;
}
</style>
