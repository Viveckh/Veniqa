<template>
  <div class="general-padding" id="order-detail">
    <div v-if="openOrder">
      <h3>Order Details</h3>

      <p class="status">
        Order Status: {{openOrder.overall_status}}
        <b-btn variant="success" size="sm" v-if="openOrder.overall_status === 'RECEIVED'">Confirm</b-btn>
        <b-btn variant="secondary" size="sm" @click="cancel()">Cancel</b-btn>
      </p>

      <h5>All Ordered Items</h5>
      <hr>

      <div class="order-item-pane">
        <div v-for="(item, itemInd) in openOrder.cart.items" v-bind:key="itemInd" :class="{'list-row': itemInd % 2 == 0}">
          <single-list-item :data="item" :dataIndex="itemInd+1" :orderStatus="openOrder.overall_status"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SingleListItem from '@/components/orders/SingleListItem';

export default {
  name: 'OrderDetail',
  components: {
    SingleListItem,
  },
  data() {
    return {};
  },

  created() {
    if (this.openOrder == null) {
      this.$router.push({ path: '/orders' });
    }
  },

  methods: {
    cancel() {
      this.$store.commit('orderStore/setOpenOrder', null);
      this.$router.push({ path: '/orders' });
    },
  },

  computed: {
    ...mapGetters({
      openOrder: 'orderStore/openOrder',
    }),
  },
};
</script>

<style lang="scss" scoped>
#order-detail {
  font-size: 0.875rem;

  .status {
    button {
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  .order-item-pane {
  }
}
</style>
