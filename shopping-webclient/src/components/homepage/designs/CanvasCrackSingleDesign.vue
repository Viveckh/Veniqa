<template>
  <div class="featured-product">
    <!-- This is for screens bigger than MD -->
    <div class="type-separator d-none d-md-block">
      <b-row style="min-height:100%">
        <b-col md="5" v-if="type == 2">
          <div :style="productImageStyle" class="product-img product-clip-right"></div>
        </b-col>
        <b-col md="7">
          <div class="product-content">
            <div class="product-body">
              <div class="body-content">
                <span class="brand">{{product.brand}}</span>
                <span class="name">{{product.name}}</span>
                <span class="amount">$ {{product.price.amount}}</span>

                <b-button class="primary-button" @click="$emit('shop', product)">Shop</b-button>
              </div>
            </div>
          </div>
        </b-col>

        <b-col md="5" v-if="type === 1">
          <div :style="productImageStyle" class="product-img product-clip"></div>
        </b-col>
      </b-row>
    </div>
    <!-- End of design for screen bigger than md -->

    <!-- Design for mobile view -->
    <div class="d-block d-md-none d-none">
      <div class="d-flex flex-row justify-content-center align-items-center">
        <div
          sm="2"
          :style="productImageStyle"
          class="box d-flex flex-column justify-content-center align-items-center"
        >
          <div class="description d-flex flex-column justify-content-center align-items-center">
            <span class="brand">{{product.brand}}</span>
            <span class="name">{{product.name}}</span>
            <span class="amount">$ {{product.price.amount}}</span>

            <span class="button-like" @click="$emit('shop', product)">Shop</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable prefer-destructuring */

export default {
  name: 'CanvasCrackSingleDesign',
  props: {
    product: {
      required: true,
      type: Object,
    },
    type: {
      required: false,
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      displayImage: null,
      productClass: null,
    };
  },

  created() {
    if (
      this.product
      && this.product.detailedImageUrls
      && this.product.detailedImageUrls.length > 0
    ) {
      this.displayImage = this.product.detailedImageUrls[0];
    }
  },

  watch: {
    product() {
      this.displayImage = this.product.detailedImageUrls[0];
    },
  },

  computed: {
    productImageStyle() {
      return {
        'background-image': `url(${this.displayImage})`,
        'background-size': 'cover',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.featured-product {
  height: 90vh;
  padding: 20px 0px;

  .button-like{
    font-size: large;
    font-weight: bold;
    margin-top: 2rem;
    padding: 1rem 2rem;
    border:1px solid transparent;
  }

  .button-like:hover{
    border: 1px solid white;
    background:white;
    color: black;
  }

  .box {
    height: 90vh;
    width: 100%;
    background-color: white;
    background-size: cover;
    background-position: center center;
    padding: 0px 0px 0px 0px !important;
  }
  .box:hover {
    background-size: cover;
    background-position: center center;
  }
  .description {
    height: inherit;
    width: inherit;
    color: rgba(0, 0, 0, 0);
  }
  .description:hover {
    color: white;
    background-color: #1b1a1a66;
    -webkit-transition: background-color 200ms linear;
    -ms-transition: background-color 200ms linear;
    transition: background-color 200ms linear;
  }

  .product-img {
    height: 90vh;
  }

  .product-clip {
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: right;
  }

  .product-clip-right {
    -webkit-clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
    clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: left;
  }

  .type-separator {
    height: 100%;
  }

  .product-content {
    display: table;
    height: 100%;
    width: 100%;

    .product-body {
      display: table-row;
      .body-content {
        display: table-cell;
        vertical-align: middle;
        padding-left: 3rem;
        padding-right: 1.5rem;

        &.content-prop {
          font-size: 2em;
        }

        span {
          display: block;
          font-size: 1.3em;
          padding: 10px 0px;
        }

        button {
          padding: 10px 50px;
        }

        .brand {
          font-weight: bold;
        }
      }

      .image {
        height: 100px;
        width: 100%;
      }
    }
  }
}
</style>
