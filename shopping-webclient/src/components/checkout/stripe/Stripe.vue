<template>
  <div>
    <!-- <stripe-payment/> -->
    <card
      class="stripe-card"
      :class="{ complete }"
      :stripe="stripeKey"
      :options="stripeOptions"
      :paymentReqOptions="reqParams"
      @change="complete = $event.complete"
      @token="payWithGpay"
    />
    <br />
    <b-btn
      class="pay-with-stripe"
      @click="pay($event)"
      :disabled="!complete"
      style="font-family: Libre Baskerville; font-size: 14px"
      >Pay by card</b-btn
    >
  </div>
</template>

<script>
import _ from 'lodash';
import { Card, Stripe } from './index';
import PaymentRequestDTO from './StripePaymentRequestDTO.json';
import { mapGetters } from 'vuex';
import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';

export default {
  components: {
    Card,
  },
  props: {
    totalCost: {
      // type: Number || String,
      required: true,
    },

    stripeKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      // stripeKey: '',
      reqParams: _.cloneDeep(PaymentRequestDTO),
    };
  },

  watch: {
    totalCost(val) {
      this.reqParams.total.amount = parseInt(val);
    },
  },

  methods: {
    async pay(event) {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      try {
        // const data = await Stripe.createToken();
        // this.$emit('pay', data.token);
        event.target.disabled = true;
        let checkoutId = this.checkoutId;
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrl.stripeInstantPay,
          method: 'post',
          data: {
            checkoutId,
          },
        });
        if (data && data.httpStatus === 200) {
          console.log(data.responseData);
          if (data.responseData) {
            const paymentMethodReq = await Stripe.createPaymentMethod(
              'card',
              {}
            );
            console.log(paymentMethodReq);

            if (paymentMethodReq.paymentMethod.id) {
              const confirmPayment = await Stripe.confirmCardPayment(
                data.responseData.client_secret,
                {
                  payment_method: paymentMethodReq.paymentMethod.id,
                }
              );

              console.log(confirmPayment);

              if (confirmPayment) {
                console.log('inside confirmPayment', confirmPayment);
                if (confirmPayment.paymentIntent.status == 'succeeded') {
                  console.log('inside confirmPayment status', confirmPayment);
                  if (confirmPayment.hasOwnProperty('error')) {
                    this.$notify({
                      group: 'toast',
                      type: 'error',
                      text: `${confirmPayment.error.code},  ${confirmPayment.error.message}. Please try again later`,
                    });
                    event.target.disabled = false;
                  }
                  const { data } = await Vue.prototype.$axios({
                    url: ProxyUrl.stripeInstantPayment,
                    method: 'post',
                    data: {
                      checkoutId,
                      paymentToken: confirmPayment.paymentIntent.id,
                    },
                  });
                  if (data && data.httpStatus === 200) {
                    return this.$router.push('/orders');
                    //return data.responseData;
                  }
                  //this.createPayment(confirmPayment.paymentIntent.id);
                } else {
                  event.target.disabled = false;
                  throw new Error('Card  details are invalid !');
                }
              }
            }
          }
          // const { data } = await Vue.prototype.$axios({
          //   url: ProxyUrl.stripePay,
          //   method: 'post',
          //   data: {
          //     checkoutId,
          //     paymentToken: token.id,
          //   },
          // });
          /**
           * Response data:
           * {
           *    orderId: 'xxx'
           * }
           */
          //return data.responseData;
        }
        //  const data = await Stripe.createToken();
        console.log('stripe payWithStripe token', this.checkoutId);
        //this.$emit('pay', data.token);
      } catch (error) {
        console.log('Stripe error', error.message);
      }
      // let data  = await Stripe.createToken().then(data => console.log(data.token))
    },

    payWithGpay(token) {
      this.$emit('pay', token);
    },
  },

  computed: {
    ...mapGetters({
      checkoutId: 'cartStore/checkoutId',
    }),
    // reqParams() {
    //   let params = _.cloneDeep(PaymentRequestDTO);
    //   params.total.amount = this.totalCost;
    //   return params;
    // }
  },
};
</script>

<style lang="scss" scoped>
.pay-with-stripe {
  padding: 5px;
  background-image: linear-gradient(to right, #267871, #136a8a) !important;
}
</style>
