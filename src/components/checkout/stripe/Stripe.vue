<template>
  <div>
    <!-- <stripe-payment/> -->
    <card class='stripe-card'
      :class='{ complete }'
      :stripe='stripeKey'
      :options='stripeOptions'
      :paymentReqOptions='reqParams'
      @change='complete = $event.complete'
      @token='payWithGpay'
    /> 
    <br>
    <b-btn class='pay-with-stripe' @click='pay' :disabled='!complete'>Pay with credit card</b-btn> 
  </div>
</template>

<script>
import {Card, Stripe} from './index'
import paymentService from '@/services/paymentService'
import { mapGetters } from "vuex";
import PaymentRequestDTO from './StripePaymentRequestDTO'
import _ from 'lodash';

export default {
  components: {
    Card
  },
  props: {
    totalCost: {
      // type: Number || String,
      required: true,
    },

    stripeKey: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      // stripeKey: '',
      reqParams: _.cloneDeep(PaymentRequestDTO),
    }
  },

  watch: {
    totalCost(val){
      this.reqParams.total.amount = parseInt(val);
    }
  },

  methods: {
    async pay () {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      try {
        let data = await Stripe.createToken();
        this.$emit('pay',data.token);
      } catch (error) {
        console.log("Stripe error", error.message);
      }
      // let data  = await Stripe.createToken().then(data => console.log(data.token))
    },

    payWithGpay(token) {
      this.$emit('pay',token)
    }
  },

  computed: {
    // reqParams() {
    //   let params = _.cloneDeep(PaymentRequestDTO);
    //   params.total.amount = this.totalCost;
    //   return params;
    // }
  }

  
};
</script>

<style lang="scss" scoped>
.pay-with-stripe{
  padding: 5px;
  background-image: linear-gradient(to right, #267871, #136a8a) !important;
}
</style>
