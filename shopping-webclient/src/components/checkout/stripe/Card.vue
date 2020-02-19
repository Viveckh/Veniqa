<template>
  <stripe-element
    ref='element'
    type='card'
    :stripe='stripe'
    :value='value'
    :options='options'
    :paymentReqOptions='paymentReqOptions'
    @blur='$emit("blur")'
    @focus='$emit("focus")'
    @change='$emit("change", $event)'
    @token="tokenGenerated"
  />
</template>

<script>
import props from './props';
import StripeElement from './StripeElement.vue';

export default {
  props,
  components: { StripeElement },
  methods: {
    blur() { this.$refs.element.blur(); },
    clear() { this.$refs.element.clear(); },
    focus() { this.$refs.element.focus(); },
    update(options) { this.$refs.element.update(options); },
    tokenGenerated(ev) {
      this.$emit('token', ev.token);
    },
  },
};
</script>
