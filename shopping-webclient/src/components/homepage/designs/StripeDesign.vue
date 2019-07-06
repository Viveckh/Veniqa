<template>
  <b-jumbotron>
    <div class="d-none d-md-block">
      <b-row class="d-flex flex-row justify-content-center align-items-center">
        <b-col
          sm="6"
          class="box d-flex flex-row justify-content-center align-items-center"
          v-for="(product, key) in products"
          v-bind:key="key"
        >
          <b-col
            md="6"
            class="box picture1"
            v-bind:style="{ backgroundImage: 'url(' + product.detailedImageUrls[0] + ')' }"
          ></b-col>
          <b-col
            md="6"
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
    </div>

    <!-- Design for mobile view -->
    <div class="d-block d-md-none d-none" style="background: white">
      <div class="product-card align-left" v-for="(product, key) in products" v-bind:key="key">
        <div class="link" @click="openProductDetail(product._id)">
          <div class="img-parent" v-if="product.detailedImageUrls.length > 0">
            <img class="img-cls-featured" :src="product.detailedImageUrls[0]">
          </div>

          <div class="product-card-desc">
            <p>{{product.name}}</p>
            <p>{{product.brand}}</p>
            <p>
              <strong>
                <span
                  v-if="!product.marked_price || product.marked_price.amount <= 0"
                  :class="{'underline': product.marked_price && product.marked_price.amount > 0}"
                >{{product.price.amount + ' ' + product.price.currency}}</span>
                <span
                  v-if="product.marked_price && product.marked_price.amount > 0"
                >{{product.marked_price.amount}} {{product.marked_price.currency}}</span>
              </strong>
            </p>

            <!-- <router-link :to="`/products/${product._id}`"> -->
            <b-button class="addToCart" @click="shop(product)">Shop Now</b-button>
          </div>
        </div>
      </div>
    </div>
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
  methods: {
    shop(product) {
      this.$emit('shop', product);
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

h4,
h5 {
  font-weight: bold;
}

.picture1 {
  background-color: white;

  background-size: cover;
  background-position: center center;
}

.img-cls-featured {
  border-top-right-radius: 0.25rem;
  border-top-left-radius: 0.25rem;
  height: auto;
  width: 100%;
}

.product-card {
  display: inline-block;
  // box-shadow: 3px 4px 5px 0px #ccc;
  // background-color: white;
  border-radius: 0px;
  margin: 20px 20px 30px 0px;
  width: 225px;

  .img-parent {
    height: 300px;
    width: 225px;
    overflow: hidden;
  }

  .product-card-desc {
    margin-top: 0.5em;
    .title {
      height: 2em;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .price {
      font-weight: bold;
    }
  }

  .link {
    cursor: pointer;
  }
  p {
    padding: 3px 5px;
    margin: 0px;
  }
}

.picture:hover {
  background-size: 150%;
  -webkit-transition: all 0.5s ease-in-out;
}

.picture2 {
  background-color: white;
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
