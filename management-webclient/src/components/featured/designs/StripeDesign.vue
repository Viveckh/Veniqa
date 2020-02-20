<template>
  <b-jumbotron>
    <b-row class="d-flex flex-row justify-content-center align-items-center">
      <b-col
        sm="6"
        class="box d-flex flex-row justify-content-center align-items-center"
        v-for="(product, key) in products"
        v-bind:key="key"
      >
        <b-col
          sm="6"
          class="box picture1"
          v-bind:style="{ backgroundImage: 'url(' + product.detailedImageUrls[0] + ')' }"
        ></b-col>
        <b-col
          sm="6"
          class="box description d-flex flex-column justify-content-center align-items-center"
        >
          <h4>{{product.name}}</h4>
          <p>{{product.brand}}</p>
          <h5>
            <span
              v-if="!product.marked_price || product.marked_price.amount <= 0"
              :class="{'underline': product.marked_price && product.marked_price.amount > 0}"
            >{{product.price.amount + ' ' + product.price.currency}}</span>
            <span
              v-if="product.marked_price && product.marked_price.amount > 0"
            >{{product.marked_price.amount}} {{product.marked_price.currency}}</span>
          </h5>

          <!-- <router-link :to="`/products/${product._id}`"> -->
          <b-button class="addToCart" @click="shop(product)">Shop Now</b-button>
          <!-- </router-link> -->
        </b-col>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
export default {
  name: 'FeaturedProducts',
  props: {
    products: {
      required: true,
      type: Array
    }
  },
  methods: {
    shop(product) {
      this.$emit('shop', product);
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: 75vh;
  padding: 0px 0px 0px 0px !important;
  margin: 0px 0px 0px 0px !important;
}

h4,
h5 {
  font-weight: bold;
}

.picture1 {
  background-color: white;

  background-size: cover;
  background-position: center center;
}

.picture:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}

.picture2 {
  background-color: white;
  background-size: cover;
  background-position: center center;
}

.picture:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}
.description {
  background-color: white;
}

.jumbrotron {
  background-color: white;
}
</style>
