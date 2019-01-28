<template>
  <div id="search-result">
    <div class="search-result-view">
      <h2>Search Results</h2>
      <div class="result-view">
        <div class="product-card" v-for="(product, pid) in data" v-bind:key="pid">
          <div class="link" @click="openProductDetail(product._id)">
            <div class="img-parent" v-if="product.thumbnailUrls.length > 0">
              <div
              class="img-cls"
              :style="getPictureStyle(product.thumbnailUrls[0])"

            ></div>
            </div>


            <p v-else style="font-size: 5em; padding: 10px 0px; text-align: center; color: #bdbdbd">
              <font-awesome-icon icon="shopping-bag" width="100%"/>
            </p>
            <div class="product-card-desc">
              <p class="title">
                {{product.name}}
              </p>
              <p class="price">{{product.price.currency}} {{product.price.amount}}</p>
            </div>

          </div>
          <!-- <b-button class="primary-button add-cart-button" @click="addToCart(product)">Add to Cart</b-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notification from '@/services/NotificationService';

export default {
  name: 'SearchResultView',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },

  methods: {
    getPictureStyle(img) {
      return {
        'background-image': `url(${img})`,
        'background-size': 'cover',
        // width: 'auto',
        // height: '350px',
        'margin-bottom': '10px',
      };
    },

    /**
     * @deprecated because add to cart doesn't happen from this page anymore.
    */
    async addToCart(product) {
      try {
        const val = await this.$store.dispatch('cartStore/addToTheCart', [product]);
        if (val) {
          notification.success(this, `Added ${product.name} to the cart`);
        }
      } catch (err) {
        console.log('Error', err);
        // handle notification for different status here.
        notification.error(this, `${
          product.name
        } couldn't be added for some reason. Please try again later`);
      }
    },

    openProductDetail(pid) {
      this.$router.push(`/products/${pid}`);
    },
  },
};
</script>

<style lang="scss">
.search-result-view {
  text-align: left;
  width: 80%;
  margin: auto;
  padding: 30px 0px;
  padding-bottom: 3rem;
}

#search-result {
  background-color: #f4f3ef;
}

.result-view{
  margin-top: 1em;
}

.product-card {
  display: inline-block;
  // box-shadow: 3px 4px 5px 0px #ccc;
  // background-color: white;
  border-radius: 0.25rem;
  margin: 20px 20px 20px 0px;
  width: 300px;

  &:hover .img-cls{
    transform: scale(1.2);
    transition: all 0.5s;
  }

  .img-parent{
    height: 350px;
    width: 300px;
    overflow: hidden;
  }

  .product-card-desc {
    margin-top: 0.75em;
    .title{
      height: 3.5em;
      text-overflow: ellipsis;
      overflow: auto;
    }

    .price{
      font-weight: bold;
    }
  }

  .link {
    cursor: pointer;
  }
  p {
    padding: 5px 5px;
    margin: 0px;
  }

  .img-cls {
    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
    height: 100%;
    width: 100%;
  }


  .add-cart-button {
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding: 10px 0px;
  }
}
</style>
