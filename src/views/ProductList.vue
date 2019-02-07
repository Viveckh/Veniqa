<template>
  <div id="search-result-view">
    <div class="space"></div>
    <search-result-view :data="products" :title="`Women's Clothing`"/>
  </div>
</template>

<script>
import SearchResultView from '@/components/vendor-pages/SearchResultView';

export default {
  components: {
    SearchResultView,
  },

  async created() {
    await this.$store.dispatch(
      'listStore/searchForProduct',
      "Women's Clothing",
    );
  },
  computed: {
    products() {
      console.log(this.$store.getters['listStore/listResult']);
      return this.$store.getters['listStore/listResult'];
    },
  },
};
</script>

<style lang="scss" scoped>
.filter {
  height: 100vh;
  padding: 50px;
}
.products {
  padding: 50px;
}
.content {
  background-color: #eaecee;
  text-align: left;
}
.filterLabel {
  font-weight: bold;
  margin-top: 50px;
}
.slider {
  width: inherit;
}
.box {
  height: 40vh;
  background-color: grey;
  background-size: cover;
  background-position: center center;
  padding: 0px !important;
  margin: 20px !important;
}
.box:hover {
  -webkit-transition: all 0.1s ease-in-out;
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.description {
  width: inherit;
  color: white;
  background-color: #2c2b2ad2;
  -webkit-transition: background-color 500ms linear;
  -ms-transition: background-color 500ms linear;
  transition: background-color 500ms linear;
}
.productInfo {
  margin: 0px;
  padding: 0px;
  text-align: center;
}
</style>
