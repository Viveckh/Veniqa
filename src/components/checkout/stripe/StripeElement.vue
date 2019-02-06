<template>
<div>
  <div id="payment-request-button"></div>
</div>
</template>

<script>
import props from './props'
import { create, destroy, paymentRequest, Stripe } from './stripeElements'

export default {
  // please see https://stripe.com/docs/elements/reference for details
  props: Object.assign({type: {type:String, required:true}}, props),

  beforeMount () {
    this._element = create(this.type, this.stripe, this.options)
    this._element.on('blur', event => this.$emit('blur'))
    this._element.on('focus', event => this.$emit('focus'))
    this._element.on('change', event => this.$emit('change', event))


    this._payReqButton = paymentRequest();
  },

  mounted () {
    // Vue likes to stay in control of $el but Stripe needs a real element
    const el = document.createElement('div')
    this._element.mount(el)
    // this.$children cannot be used because it expects a VNode :(
    this.$el.appendChild(el)

    

    // Check the availability of the Payment Request API first.
    console.log("Running here. ")
    Stripe.paymentRequest.canMakePayment().then(function(result) {
      console.log("Payment can be made", result)
      if (result) {
        const el1 = document.createElement('div');
        this._payReqButton.mount('#payment-request-button');
      } else {
        document.getElementById('payment-request-button').style.display = 'none';
      }
    }).catch(err => {
      console.log("Error", err) 
    });
    
  },

  beforeDestroy () {
    this._element.unmount()
    this._element.destroy()
    destroy()
  },

  methods: {
    blur () { this._element.blur() },
    clear () { this._element.clear() },
    focus () { this._element.focus() },
    update () { this._element.update() }
  }
}
</script>
