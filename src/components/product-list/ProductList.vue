<template>
  <div>
    <div class="space"></div>
    <b-jumbotron class="content">
      <b-row>
        <b-col sm="title 12"></b-col>
      </b-row>
      <b-row>
        <b-col sm="2" class="filter">
          <p class="filterLabel">Sort By</p>
          <b-form-select v-model="selectedSort" :options="optionsSort" class="mb-3"/>
          <p class="filterLabel">Categories</p>
          <b-form-radio-group v-model="selectedCategories" :options="optionsCategories" stacked/>
        </b-col>
        <b-col sm="10" class="products">
          <h4>Results</h4>
          <b-row class>
            <b-col
              sm="2"
              v-for="(product, key) in products"
              class="box d-flex flex-column justify-content-end align-items-center"
              v-bind:key="key"
              v-bind:style="{ backgroundImage: 'url(' + product.thumbnailUrls[0] + ')' }"
              href="#"
            >
              <router-link
                :to="`/products/${product._id}`"
                class="description d-flex flex-column justify-content-end align-items-center"
              >
                <h6 class="productInfo">{{product.name}}</h6>
                <p class="productInfo">{{product.brand}}</p>
                <p class="productInfo">{{product.price.currency}} {{product.price.amount}}</p>
              </router-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-jumbotron>
  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider';
// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css';

export default {
  data() {
    return {
      selectedSort: 'Recommended',
      optionsSort: ['Recommended', 'Price', 'Popularity'],
      selectedCategories: 'All Categories',
      optionsCategories: ['All Categories', 'Clothing', 'Accessories', 'Shoes'],
    };
  },
  async created() {
    await this.$store.dispatch('listStore/searchForProduct');
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
