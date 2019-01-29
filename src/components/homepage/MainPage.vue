<template>
  <div id="main-page">
    <div class="main-bg"></div>
    <h1 class="featured-title">Featured</h1>
    <featured-products/>
    <h1 class="featured-title">Hottest Trends</h1>
    <featured-stripe/>
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
@import '../../assets/css/global.scss';

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
  background-image: url('https://www.fearlesss.co.uk/media/wysiwyg/Copy_of_SPRING_TWENTY_NINETEEN-2.jpg');
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

.jumbotron {
  padding: 0px 0px 0px 0px !important;
  margin: 0px 0px 0px 0px !important;
}
.featured-title {
  margin: 0px 0px 0px 0px;
  padding: 20px 10px;
  color: #5d6d7e;
  background-color: #eaecee;
}
</style>
