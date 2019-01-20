<template>
  <div class="checkout">
    <div class="space"></div>
    <h2>Checkout</h2>

    <b-row>
      <b-col md="6">
        <shipping-detail @selected="addressSelected"/>
        <shipping-method/>
        <payment-detail/>
      </b-col>
      <b-col md="6">
        <order-detail/>
      </b-col>
    </b-row>

    <div class="checkout-button">
      <div v-if="isSessionActive">
        <b-button
          v-if="emailConfirmed && !checkoutInitiated"
          size="lg"
          class="full-width primary-button"
          @click="handleCheckout()"
        >Get Final Prices</b-button>
        <div v-else-if="!emailConfirmed">
          <p>You cannot checkout currently because your email address has not been confirmed. Please click below to resend the confirmation email</p>
          <b-button
            class="primary-button"
            @click="resendEmailConfirmation()"
          >Resend Email Confirmation</b-button>
        </div>

        <div v-if="checkoutInitiated">
          <b-btn class="primary-button" @click="handlePayment()">Pay with BKASH</b-btn> &nbsp;&nbsp;
          <b-btn disabled class="primary-button">Pay with Khalti</b-btn>
        </div>
      </div>
      <div v-else>
        <p>You need to log in first before starting checkout process</p>
      </div>
    </div>
  </div>
</template>

<script>
import ShippingDetail from '@/components/checkout/ShippingDetail.vue';
import OrderDetail from '@/components/checkout/OrderDetail.vue';
import PaymentDetail from '@/components/checkout/PaymentDetail';
import ProxyUrls from '@/constants/ProxyUrls';
import ShippingMethod from '@/components/checkout/ShippingMethod';
import { mapGetters } from 'vuex';
import notification from '@/services/NotificationService';

export default {
  name: 'Checkout',
  components: {
    ShippingDetail,
    OrderDetail,
    PaymentDetail,
    ShippingMethod,
  },

  data() {
    return {
      // selectedAddress: {},
      payment: {},
    };
  },

  methods: {
    async handlePayment() {
      try {
        const success = await this.$store.dispatch('cartStore/pay');
      } catch (error) {
        console.log(error);
        const msg = error.httpStatus ? '' : error.response.data.errorDetails;
        notification.error(this, `Error: ${msg}`, 'all');
      }
    },
    async addressSelected(selected) {
      this.$store.commit('shippingStore/addressSelected', selected);
      if (!this.checkoutInitiated) return;
      try {
        const isSuccess = await this.$store.dispatch(
          'cartStore/createCheckout',
          {
            address: this.selectedAddress,
            shippingMethod: this.shippingMethod,
          },
        );
      } catch (error) {
        notification.error(
          this,
          'Something went haywire while trying to recalculate the prices. Please try again by changing address.',
        );
      }
    },

    async handleCheckout() {
      if (!this.selectedAddress || !this.shippingMethod) {
        notification.warn(
          this,
          'The shipping method and address should be selected first.',
        );
        return;
      }
      await this.$store.dispatch('cartStore/createCheckout', {
        address: this.selectedAddress,
        shippingMethod: this.shippingMethod,
      });
    },

    async resendEmailConfirmation() {
      try {
        const res = await this.$axios({
          method: 'get',
          url:
            ProxyUrls.resendEmailConfirmation
            + this.$store.getters['authStore/getEmail'],
        });

        this.$notify({
          group: 'all',
          type: 'success',
          text:
            'Confirmation email has been sent to your email address. Please check your email.',
        });
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'There was an error sending out the email. Please try again later',
        });
      }
    },
  },

  computed: {
    ...mapGetters({
      selectedAddress: 'shippingStore/getSelectedAddress',
      shippingMethod: 'shippingStore/shippingMethod',
      isSessionActive: 'authStore/isSessionActive',
      checkoutInitiated: 'cartStore/checkoutInitiated',
      emailConfirmed: 'authStore/emailConfirmed',
    }),
  },
};
</script>

<style lang="scss">
.checkout {
  padding: 0rem 2rem;
  margin-bottom: 10px;
  padding-bottom: 3rem;
  min-height: 90vh;
  position: relative;

  .checkout-button {
    margin-top: 20px;
    padding: 0rem 2rem;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
