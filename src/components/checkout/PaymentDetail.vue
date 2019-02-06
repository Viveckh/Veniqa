<template>
  <div>
    <!-- <stripe-payment/> -->
    <card class='stripe-card'
      :class='{ complete }'
      :stripe='stripeKey'
      :options='stripeOptions'
      @change='complete = $event.complete'
    /> 
    <b-btn class='pay-with-stripe' @click='pay' :disabled='!complete'>Pay with credit card</b-btn> 
  </div>
</template>

<script>
import {Card, Stripe} from './stripe'

export default {
  components: {
    Card
  },
  data () {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      },
      stripeKey: 'pk_test_ulpX3vj4B28cfSq7Evkt1pFz'
    }
  },

  // components: { Card },

  methods: {
    pay () {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      Stripe.createToken().then(data => console.log(data.token))
    }
  }
};
</script>

<style lang="scss">
</style>
