<template>
  <div id="payment">
    <h4>Payment</h4>
    <hr />
    <stripe-payment :totalCost="totalPrice" :stripeKey="stripeKey" @pay="startPayment" />
    <br />
    <hr />
    <div class="align-center">
      <b-btn class="primary-button" @click="handlePayment()">Pay with BKASH</b-btn>&nbsp;&nbsp;
    </div>
    <!-- <b-btn disabled class="primary-button">Pay with Khalti</b-btn> -->
    <div class="align-center">
      <khalti :text="'Pay with Khalti'" :config="khaltiConfig" :total="totalPrice" />
    </div>
  </div>
</template>

<script>
import StripePayment from '@/components/checkout/stripe/Stripe.vue';
import { mapGetters } from 'vuex';
import notification from '@/services/notificationService';
import paymentService from '@/services/paymentService';
import Config from '@/config.json';
import { Khalti } from '@/components/checkout/khalti';

export default {
  name: 'PaymentDetail',
  components: {
    StripePayment,
    Khalti,
  },

  data() {
    return {
      stripeKey: Config.STRIPE_KEY,
      khaltiConfig: {
        productIdentity: '0000',
        productName: 'Veniqa',
        key: Config.KHALTI_KEY,
      },
    };
  },

  created() {
    this.khaltiConfig.productIdentity = this.checkoutId;
  },

  methods: {
    async startPayment(token) {
      if (!this.checkoutId || this.checkoutId.length <= 0) return;
      try {
        const data = await paymentService.payWithStripe(token, this.checkoutId);

        this.$store.commit('cartStore/resetOrders');
        this.$router.push(`/orders/${data.order_id}`);
        notification.success(this, 'Payment was successful.');
        console.log('payWithStripe token', token);
      } catch (error) {
        console.log('Error with Veniqa payment', error);
        notification.error(
          this,
          'Payment could not be completed at the moment',
        );
      }
    },

    async startKhaltiPayment(payload) {
      if (!this.checkoutId || this.checkoutId.length <= 0) return;

      try {
        const data = await paymentService.payWithKhalti(
          payload.token,
          this.checkoutId,
        );

        this.$store.commit('cartStore/resetOrders');
        this.$router.push(`/orders/${data.order_id}`);
        notification.success(this, 'Payment was successful.');
      } catch (error) {
        console.log('Error with Veniqa payment', error);
        notification.error(
          this,
          'Payment could not be completed at the moment',
        );
      }
    },

    async handlePayment() {
      try {
        await this.$store.dispatch('cartStore/pay');
        notification.success(this, 'Payment processed');
        this.shippingMethod = null;
      } catch (error) {
        console.log(error);
        const msg = error.httpStatus ? '' : error.response.data.errorDetails;
        notification.error(this, `Error: ${msg}`, 'all');
      }
    },
  },

  computed: {
    ...mapGetters({
      checkoutId: 'cartStore/checkoutId',
    }),

    totalPrice() {
      const cost = this.$store.getters['cartStore/getTotal'];
      if (cost == null) return 0;
      return parseInt(cost.amount * 100);
    },

    shippingMethod: {
      get() {
        return this.$store.getters['shippingStore/shippingMethod'];
      },
      set(val) {
        this.$store.commit('shippingStore/setShippingMethod', val);
      },
    },
  },
};
</script>

<style lang="scss">
#payment {
  margin: 2rem 0rem;
}
</style>
