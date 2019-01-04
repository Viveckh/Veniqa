<template>
  <div class="featured-product">
    <b-row style="height: 100%">
      <b-col md="4">
        <div class="product-content">
          <div class="product-body">
            <div class="body-content">
              <span class="brand">{{product.brand}} </span>
              <span class="name">{{product.name}}</span> 
              <span class="amount">$ {{product.price.amount}}</span>

              <b-button class="primary-button">Shop</b-button>
            </div>
          </div>
        </div>
      </b-col>
      <b-col md="8">
        <div :style="productImageStyle" class="product-clip"></div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "FeaturedProductView",
  props: {
    product: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      displayImage: null,
      productClass: null
    };
  },

  created() {
    if (
      this.product &&
      this.product.thumbnailUrls &&
      this.product.thumbnailUrls.length > 0
    ) {
      this.displayImage = this.product.thumbnailUrls[0];
      // this.productClass = this.productImageStyle();
    }
  },

  computed: {
    productImageStyle() {
      return {
        "background-image": `url(${this.displayImage})`,
        // 'background-size': 'fit',
        height: "100%"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.featured-product {
  height: 90vh;
  padding: 20px 20px;

  .product-clip {
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%);
clip-path: polygon(0 0, 100% 0, 100% 100%, 13% 100%);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
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

        &.content-prop{
          font-size: 2em;

        }

        span{
          display: block;
          font-size: 1.3em;
          padding: 10px 0px;
        }

        button{
          padding: 10px 50px;
        }

        .brand{
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
