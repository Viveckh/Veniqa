<template>
  <div class="product-list-view">
    <search-result-view :data="products" :title="searchTerm" :menu="categories"/>
  </div>
</template>

<script>
import SearchResultView from '@/components/vendor-pages/SearchResultView.vue';

export default {
  components: {
    SearchResultView
  },
  props: {
    searchTerm: {
      type: String,
      required: true
    }
  },
  watch: {
    async searchTerm() {
      await this.$store.dispatch('listStore/searchForProduct', this.searchTerm);
    }
  },

  async created() {
    await this.$store.dispatch('listStore/getCategoriesData');
    await this.$store.dispatch('listStore/searchForProduct', this.searchTerm);
  },

  computed: {
    products() {
      return this.$store.getters['listStore/listResult'];
    },
    categories(){
      let returnedData = (this.$store.getters['listStore/getCategories']);
      console.log("hereeeeeeeeeeeeee", returnedData)
     if(this.searchTerm=="Men"){
           return {"Men's Clothing": returnedData["Men's Clothing"]}
     }else{
            return {"Women's Clothing": returnedData["Women's Clothing"]}
     }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
