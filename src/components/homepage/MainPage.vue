<template>
  <div id="main-page">
<<<<<<< HEAD
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
=======
    <div class="main-bg"></div>
    <h1 class="featured-title">Featured</h1>
    <featured-products/>
    <h1 class="featured-title">Hottest Trends</h1>
    <featured-stripe/>
>>>>>>> arjun
  </div>
</template>

<script>
import Product from '@/data/featuredProduct.json';
import FeaturedProducts from '@/components/homepage/FeaturedProducts.vue';
import FeaturedCategories from '@/components/homepage/FeaturedCategories.vue';
import FeatureService from '@/services/FeaturedService';
import FeaturedStripe from '@/components/homepage/FeaturedStripe.vue';

export default {
  name: 'MainPage',
  components: {
    FeaturedCategories,
    FeaturedProducts,
    FeaturedStripe,
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
<<<<<<< HEAD
  background-image: url(./../../assets/images/lv.jpg);
=======
  background-image: url("https://www.fearlesss.co.uk/media/wysiwyg/Copy_of_SPRING_TWENTY_NINETEEN-2.jpg");
>>>>>>> arjun
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

<<<<<<< HEAD
.featured-title {
  margin: 20px 0px;
=======
.jumbotron {
  padding: 0px 0px 0px 0px !important;
  margin: 0px 0px 0px 0px !important;
}
.featured-title {
  margin: 0px 0px 0px 0px;
  padding: 20px 10px;
  color: #5d6d7e;
  background-color: #eaecee;
>>>>>>> arjun
}
</style>
