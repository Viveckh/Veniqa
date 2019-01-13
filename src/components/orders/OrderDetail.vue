<template>
  <div class="general-padding" id="order-detail">
    <div v-if="openOrder">
      <h3>Order Details</h3>

      <p class="status">
        <b-row>
          <b-col md="6">
            Order Status:
            <span class="item-status">{{openOrder.overall_status}}</span>
          </b-col>
          <b-col md="6">
            <div class="align-right">
              <b-btn
                variant="success"
                size="sm"
                v-if="openOrder.overall_status === 'RECEIVED'"
                @click="showConfirmation = true"
              >Confirm Order</b-btn>
              <b-btn variant="danger" disabled size="sm" @click="cancel()">Cancel Order</b-btn>
            </div>
          </b-col>
        </b-row>
      </p>

      <h5>All Ordered Items</h5>
      <hr>

      <div class="order-item-pane">
        <div
          v-for="(item, itemInd) in openOrder.cart.items"
          v-bind:key="itemInd"
          :class="{'list-row': itemInd % 2 == 0}"
        >
          <single-list-item
            :data="item"
            :dataIndex="itemInd+1"
            :orderStatus="openOrder.overall_status"
            :order="openOrder"
          />
        </div>
      </div>
    </div>

    <confirmation-page v-if="showConfirmation" @yes="yesClicked" @no="showConfirmation = false"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SingleListItem from '@/components/orders/SingleListItem';
import ConfirmationPage from '@/components/common/ConfirmationPage';

export default {
  name: 'OrderDetail',
  components: {
    SingleListItem,
    ConfirmationPage,
  },
  data() {
    return {
      showConfirmation: false,
    };
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

    async yesClicked() {
      await this.confirmOrder();
      this.showConfirmation = false;
    },

    async confirmOrder() {
      try {
        const isSuccess = await this.$store.dispatch('orderStore/confirmOrder');

        if (isSuccess) {
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'Order was confirmed.',
          });
        }
      } catch (error) {
        console.log('Error', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'Order could not be confirmed at the moment. Please try again later.',
        });
      }
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
