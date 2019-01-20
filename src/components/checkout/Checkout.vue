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

    <div class="checkout-button" >
      <b-button v-if="this.$store.getters['authoStore/emailConfirmed']" class="primary-button" @click="handleCheckout()">Checkout</b-button>
      <div v-else>
      <p>You cannot checkout currently because your email address has not been confirmed. Please click below to resend the confirmation email</p>
      <b-button class="primary-button" @click="resendEmailConfirmation()">Resend Email Confirmation</b-button>

      </div>
    </div>
  </div>
</template>

<script>
import ShippingDetail from '@/components/checkout/ShippingDetail.vue';
import OrderDetail from '@/components/checkout/OrderDetail.vue';
import PaymentDetail from '@/components/checkout/PaymentDetail';
import ProxyUrls from '@/constants/ProxyUrls';
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

    async resendEmailConfirmation() {
      try {
        const res = await this.$axios({
          method: 'get',
          url: ProxyUrls.resendEmailConfirmation + this.$store.getters['authStore/getEmail'],
        });

        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Confirmation email has been sent to your email address. Please check your email.',
        });
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error sending out the email. Please try again later',
        });
      }
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
