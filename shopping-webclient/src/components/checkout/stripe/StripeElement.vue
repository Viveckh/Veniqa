<template>
  <div>
    <div id="payment-request-button"></div>
    <br>
    <div id="card-cc"></div>
  </div>
</template>

<script>
import props from './props';
import {
  create, destroy, createPaymentRequest, createPayButton,
} from './stripeElements';

export default {
  // please see https://stripe.com/docs/elements/reference for details
  props: Object.assign({ type: { type: String, required: true } }, props),

  beforeMount() {
    this._card = create(this.type, this.stripe, this.options);
    this._card.on('blur', () => this.$emit('blur'));
    this._card.on('focus', () => this.$emit('focus'));
    this._card.on('change', event => this.$emit('change', event));

    this._paymentRequest = createPaymentRequest(this.paymentReqOptions);
    this._paymentRequest.on('change', event => this.$emit('pchange', event));
    // Callback when the shipping address is updated.
    this._paymentRequest.on('shippingaddresschange', (event) => {
      event.updateWith({ status: 'success' });
    });

    console.log('stripe element payWithStripe token');

    this._paymentRequest.on('token', ev => this.$emit('token', ev));

    this._paymentBtn = createPayButton();
  },

  async mounted() {
    // Vue likes to stay in control of $el but Stripe needs a real element
    // const el = document.createElement('div');
    this._card.mount('#card-cc');

    // Check if the Payment Request is available (or Apple Pay on the Web).
    const paymentRequestSupport = await this._paymentRequest.canMakePayment();
    if (paymentRequestSupport) {
      // Display the Pay button by mounting the Element in the DOM.
      this._paymentBtn.mount('#payment-request-button');
    }
  },

  beforeDestroy() {
    this._card.unmount();
    this._card.destroy();
    destroy();
  },

  methods: {
    blur() { this._card.blur(); },
    clear() { this._card.clear(); },
    focus() { this._card.focus(); },
    update() { this._card.update(); },
  },
};
</script>
