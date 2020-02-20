<template>
  <div id="design-entry">
    <!-- This previews design specific to the type of the design we have  -->
    <div v-if="design && design.config.design_type === 'Stripe'">
      <stripe-design :products="design.products" @shop="shop"/>
    </div>
    <div v-else-if="design && design.config.design_type === 'Canvas Left Cracked'">
      <canvas-crack-single :product="design.products[0]" :type="2"  @shop="shop"/>
    </div>
    <div v-else-if="design && design.config.design_type === 'Canvas Right Cracked'">
      <canvas-crack-single :product="design.products[0]" :type="1"  @shop="shop"/>
    </div>
  </div>
</template>

<script>
import StripeDesign from '@/components/featured/designs/StripeDesign.vue';
import CanvasCrackSingle from '@/components/featured/designs/CanvasCrackSingleDesign.vue';

export default {
  props: {
    design: {
      type: Object,
      required: true,
    }
  },
  components: {
    StripeDesign,
    CanvasCrackSingle
  },

  methods: {
    shop(product) {
      this.$emit('shop', product);
    }
  }
};
</script>

<style lang="scss">
#design-entry{
  font-family: 'Quicksand', sans-serif;
}
</style>
