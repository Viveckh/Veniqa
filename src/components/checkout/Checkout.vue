<template>
  <div class="checkout">
    <div class="space"></div>
    <h2>Checkout</h2>

    <b-row>
      <b-col md="6">
        <shipping-detail @selected="addressSelected"/>
        <payment-detail/>
      </b-col>
      <b-col md="6">
        <order-detail/>
      </b-col>
    </b-row>

    <div class="checkout-button">
      <b-button class="primary-button" @click="handleCheckout()">Checkout</b-button>
    </div>
  </div>
</template>

<script>
import ShippingDetail from '@/components/checkout/ShippingDetail.vue';
import OrderDetail from '@/components/checkout/OrderDetail.vue';
import PaymentDetail from '@/components/checkout/PaymentDetail';
import { mapGetters } from 'vuex';

export default {
  name: 'Checkout',
  components: {
    ShippingDetail,
    OrderDetail,
    PaymentDetail,
  },

  data() {
    return {
      // selectedAddress: {},
      payment: {},
    };
  },

  methods: {
    addressSelected(selected) {
      // this.selectedAddress = selected;
      this.$store.commit('shippingStore/addressSelected', selected);
    },

    async handleCheckout() {
      await this.$store.dispatch('cartStore/initiateCheckout', {
        address: this.selectedAddress,
        payment: 'BKASH',
      });
    },
  },

  computed: {
    ...mapGetters({
      selectedAddress: 'shippingStore/getSelectedAddress',
    }),
  },
};
</script>

<style lang="scss">
.checkout{
  // width: 90%;
  // margin: auto;
  padding: 0rem 2rem;
  margin-bottom: 10px;

  .checkout-button{
    margin-top: 20px;
  }
}
</style>
