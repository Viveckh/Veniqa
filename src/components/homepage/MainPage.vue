<template>
  <div id="main-page">
    <div class="main-bg">
      <div class="content">
        <div class="main-content">
          <h3>Shop with us this Valentine's season</h3>
          <hr>
          <a href="">Shop Men</a> &nbsp;&nbsp;&nbsp;
          <a href="">Shop Women</a>
        </div>
      </div>
    </div>

    <!-- Other contents go here. They are featured contents -->
    <h1 class="featured-title">Featured</h1>

    <div v-for="(prd, pid) in featuredProducts" v-bind:key="pid">
      <featured-product-view :product="prd"/>
    </div>
  </div>
</template>

<script>
import Product from '@/data/featuredProduct.json';
import FeaturedProductView from '@/components/homepage/FeaturedProductView';
import FeatureService from '@/services/FeaturedService';

export default {
  name: 'MainPage',
  components: {
    FeaturedProductView,
  },
  data() {
    return {
      product: null,
      featuredProducts: [],
      currentSection: 'homepage',
    };
  },

  created() {
    this.product = Product;

    FeatureService.getFeatureListFor(this.currentSection)
      .then((data) => {
        this.featuredProducts = data;
      })
      .catch((err) => {});
  },
};
</script>

<style lang="scss">
@import "../../assets/css/global.scss";

.veniqa-button:hover {
  background-color: $pitch-black;
  border: 2px solid $pitch-black;
}
.absolute-buttons {
  position: absolute;
  bottom: 0;
  width: 100%;
  margin-bottom: 100px;
}

.main-bg {
  background-image: url(./../../assets/images/lv.jpg);
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;

  .content {
    margin-top: 100px;
    display: flex;
    height: 100%;
    margin: auto;

    div {
      margin: auto;
    }
  }
}

.featured-title {
  margin: 20px 0px;
}
</style>
