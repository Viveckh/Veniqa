<template>
  <div id="search-result">
    <div class="search-result-view">
      <h2>Search Results for Fossil Watches</h2>
      <div class="result-view">
        <div class="product-card" v-for="(product, pid) in data" v-bind:key="pid">
          <div
            class="img-cls"
            :style="getPictureStyle(product.picture_urls[0])"
            v-if="product.picture_urls.length > 0"
          ></div>

          <p v-else style="font-size: 5em; padding: 10px 0px; text-align: center; color: #bdbdbd">
            <font-awesome-icon icon="shopping-bag" width="100%"/>
          </p>
          <p><strong>{{product.name}}</strong></p>
          <p>{{product.price}}</p>
          <b-button class="primary-button add-cart-button" @click="addToCart(product)">Add to Cart</b-button>
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

  methods: {
    getPictureStyle(img) {
      return {
        'background-image': `url(${img})`,
        'background-size': 'cover',
        width: '100%',
        height: '250px',
        'margin-bottom': '10px',
      };
    },

    addToCart(product) {
      this.$store.dispatch('cartStore/addToTheCart', product);
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

#search-result {
  background-color: #f4f3ef;
}

.product-card {
  display: inline-block;
  box-shadow: 3px 4px 5px 0px #ccc;
  background-color: white;
  border-radius: 0.25rem;
  margin: 20px 20px 20px 0px;
  width: 300px;

  p{
    padding: 5px 30px;
    margin: 0px;
  }

  .img-cls{
    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
  }

  .add-cart-button{
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding: 10px 0px;
  }
}
</style>
