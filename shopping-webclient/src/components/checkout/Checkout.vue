<template>
  <div class="checkout">
    <div class="space"></div>
    <h2 class="featured-title">Checkout</h2>

    <b-row>
      <b-col md="6">
        <b-card bg-variant="light" title="Shipping Details" class="text-left">
          <shipping-detail @selected="addressSelected"/>
          <shipping-method/>
          <transition
            name="shipping-form-anim"
            enter-active-class="animated slideInLeft faster"
            leave-active-class="animated slideOutLeft faster"
          >
            <payment-detail v-if="checkoutInitiated"/>

          </transition>
        </b-card>
      </b-col>
      <b-col md="6">
        <b-card bg-variant="light" title="Your Order" class="text-left">
          <order-detail/>
        </b-card>
      </b-col>
    </b-row>

    <div class="bottom-space"></div>
    <div class="checkout-button">
      <div v-if="isSessionActive">
        <div
          v-if="emailConfirmed && !checkoutInitiated && carts.length > 0"
        >
          <b-button
            size="lg"
            class="full-width primary-button"
            @click="handleCheckout()"
          >Get Final Prices</b-button>
          <br />
          <br />
        </div>
        <div v-else-if="!emailConfirmed">
          <p>You cannot checkout currently because your email address has not been confirmed.
            Please click below to resend the confirmation email</p>
          <b-button
            class="primary-button"
            @click="resendEmailConfirmation()"
          >Resend Email Confirmation</b-button>
        </div>

        <div v-if="checkoutInitiated">

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
import PaymentDetail from '@/components/checkout/PaymentDetail.vue';
import ProxyUrls from '@/constants/ProxyUrls';
import ShippingMethod from '@/components/checkout/ShippingMethod.vue';
import { mapGetters } from 'vuex';
import notification from '@/services/notificationService';

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

  created() {
    // if(!this.isSessionActive || this.carts.length <= 0){
    //   this.$router.push('/');
    // }
  },

  methods: {

    async addressSelected(selected) {
      this.$store.commit('shippingStore/addressSelected', selected);
      if (!this.checkoutInitiated) return;
      try {
        await this.$store.dispatch('cartStore/createCheckout', {
          address: this.selectedAddress,
          shippingMethod: this.shippingMethod,
        });
      } catch (error) {
        notification.error(
          this,
          'Something went haywire while trying to recalculate the prices. Please try again by changing address.',
        );
      }
    },

    async handleCheckout() {
      if (!this.selectedAddress || !this.shippingMethod) {
        notification.warn(this, 'The shipping method and address should be selected first.');
        return;
      }
      await this.$store.dispatch('cartStore/createCheckout', {
        address: this.selectedAddress,
        shippingMethod: this.shippingMethod,
      });
    },

    async resendEmailConfirmation() {
      try {
        const { data } = await this.$axios({
          method: 'get',
          url: ProxyUrls.resendEmailConfirmation + this.$store.getters['authStore/getEmail'],
        });

        if (data && data.httpStatus === 200) {
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'Confirmation email has been sent to your email address. Please check your email.',
          });
        }
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
      carts: 'cartStore/getCart',
      isSessionActive: 'authStore/isSessionActive',
      checkoutInitiated: 'cartStore/checkoutInitiated',
      emailConfirmed: 'authStore/emailConfirmed',
    }),

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
.checkout {
  padding: 0rem 2rem;
  margin-bottom: 10px;
  padding-bottom: 3rem;
  min-height: 90vh;
  position: relative;
  background-color: #eaecee;

  .bottom-space {
    height: 40px;
  }

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
