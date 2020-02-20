<template>
  <div class="featured-product">
    <div v-if="type == 1" class="type-separator">
      <b-row style="height: 100%">
        <b-col md="4">
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
        <b-col md="8">
          <div :style="productImageStyle" class="product-clip"></div>
        </b-col>
      </b-row>
    </div>

    <div v-if="type == 2"  class="type-separator">
      <b-row style="height: 100%">
        <b-col md="8">
          <div :style="productImageStyle" class="product-clip-right"></div>
        </b-col>
        <b-col md="4">
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

      </b-row>
    </div>
  </div>
</template>

<script>
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
      // eslint-disable-next-line prefer-destructuring
      this.displayImage = this.product.detailedImageUrls[0];
    }
  },

  watch: {
    product() {
      // eslint-disable-next-line prefer-destructuring
      this.displayImage = this.product.detailedImageUrls[0];
    },
  },

  computed: {
    productImageStyle() {
      return {
        'background-image': `url(${this.displayImage})`,
        // 'background-size': 'fit',
        height: '100%',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.featured-product {
  height: 90vh;
  padding: 20px 0px;

  .product-clip {
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
  }

  .product-clip-right{
    -webkit-clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);


    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
  }

  .type-separator{
    height:100%;
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
