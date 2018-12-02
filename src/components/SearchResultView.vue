<template>
  <div id="search-result">
    <div class="search-result-view">
    <h2>Search Results for Fossil Watches</h2>
      <div class="result-view">
        <div class="product-card"
          v-for="(product, pid) in data"
          v-bind:key="pid"
        >
          <h4>{{product.name}}</h4>
          <hr>
          <h5>{{product.price}} </h5>
          <b-button variant="warning">Add to Cart</b-button>
        </div>
    </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'SearchResultView',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.search-result-view {
  text-align: left;
  width: 80%;
  margin: auto;
  padding: 20px 0px;
}

#search-result{
  background-color: #F4F3EF;
}

.product-card{
  display: inline-block;
  padding: 10px 30px;
  box-shadow: 3px 3px 5px 0px #ccc;
  background-color: white;
  margin: 20px 20px 20px 0px;
  width: 300px;
}
</style>
