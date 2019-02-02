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
          <h5>{{product.price.amount + ' ' + product.price.currency}}</h5>

          <router-link :to="`/products/${product._id}`">
            <b-button>Shop Now</b-button>
          </router-link>
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
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    gotoProduct() {
      console.log('PR', this.product);
      this.$router.push(`/products/${this.product._id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 75vh;
  padding: 0px 0px 0px 0px !important;
  margin: 0px 0px 0px 0px !important;
}

.picture1 {
  background-color: red;

  background-size: cover;
  background-position: center center;
}

.picture:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}

.picture2 {
  background-color: red;
  background: url('https://cdnb.lystit.com/photos/a1b0-2014/06/13/forever-21-purple-lace-up-buckled-combat-boots-product-1-20804550-0-230022788-normal.jpeg');
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
