<template>
  <div></div>
</template>

<script>
import ProxyUrls from '@/constants/ProxyUrls';

export default {
  name: 'ProductDetail',
  props: {
    productId: {
      type: String,
      required: true,
    },
  },

  async created() {
    if (this.productId) {
      try {
        const { data } = await this.$axios({
          url: ProxyUrls.getProductDefinitionUrl + this.productId,
          type: 'get',
        });
        if (data) {
          this.product = data;
        }
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'Product detail could not be retrieved at the moment. Please try again later.',
        });
      }
    }
  },

  data() {
    return {
      product: null,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
