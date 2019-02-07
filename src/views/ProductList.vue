<template>
  <div class="product-list-view">
    <div class="space"></div>
    <search-result-view :data="products" :title="searchTerm"/>
  </div>
</template>

<script>
import SearchResultView from '@/components/vendor-pages/SearchResultView.vue';

export default {
  components: {
    SearchResultView,
  },
  props: {
    searchTerm: {
      type: String,
      required: true,
    },
  },
  watch: {
    async searchTerm() {
      await this.$store.dispatch('listStore/searchForProduct', this.searchTerm);
    },
  },

  async created() {
    await this.$store.dispatch('listStore/searchForProduct', this.searchTerm);
  },

  computed: {
    products() {
      return this.$store.getters['listStore/listResult'];
    },
  },
};
</script>

<style lang="scss" scoped>
.product-list-view {
  width: 80%;
  margin: auto;
  margin-bottom: 10px;
}
</style>
