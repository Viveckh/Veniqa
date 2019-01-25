<template>
  <div id="main-page">
    <div class="main-bg">
      <div class="absolute-buttons">
        <b-button class="veniqa-button">Hottest Deals</b-button>
        <b-button class="veniqa-button">Christmas Deals</b-button>
        <b-button class="veniqa-button">How Veniqa Works
          <font-awesome-icon icon="play"/>
        </b-button>
      </div>
    </div>

    <!-- Other contents go here. They are featured contents -->
    <h1 class='featured-title'>Featured</h1>

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

    FeatureService.getFeatureListFor(this.currentSection).then((data) => {
      this.featuredProducts = data;
    }).catch((err) => {

    });
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
  background-image: url(./../../assets/images/background.png);
  height: 100vh;
  background-size: cover;
}

.featured-title{
  margin: 20px 0px;

}
</style>
