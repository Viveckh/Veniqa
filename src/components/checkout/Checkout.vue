<template>
  <div class="checkout">
    <div class="space"></div>
    <h2>Checkout</h2>

    <b-row>
      <b-col md="6">
        <shipping-detail :selected="selectedAddress" @selected="addressSelected"/>
        <payment-detail/>
      </b-col>
      <b-col md="6">
        <order-detail/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ShippingDetail from '@/components/checkout/ShippingDetail.vue';
import OrderDetail from '@/components/checkout/OrderDetail.vue';
import PaymentDetail from '@/components/checkout/PaymentDetail';

export default {
  name: 'Checkout',
  components: {
    ShippingDetail,
    OrderDetail,
    PaymentDetail,
  },

  data() {
    return {
      selectedAddress: {},
      payment: {},
    };
  },

  methods: {
    addressSelected(selected) {
      this.selectedAddress = selected;
    },
  },
};
</script>

<style lang="scss">
.checkout{
  width: 90%;
  margin: auto;
  margin-bottom: 10px;
}
</style>
