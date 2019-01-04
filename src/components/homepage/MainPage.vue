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
    <featured-product-view
      :product="product"
    />
  </div>
</template>

<script>
import Product from '@/data/featuredProduct.json'
import FeaturedProductView from '@/components/homepage/FeaturedProductView'

export default {
  name: 'MainPage',
  components: {
    FeaturedProductView
  },
  data() {
    return {
      product: null
    }
  },

  created() {
    this.product = Product
  }
};
</script>

<style lang="scss" scoped>
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
