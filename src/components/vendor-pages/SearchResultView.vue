<template>
  <div id="search-result">
    <div class="search-result-view">
      <h2>Search Results for Fossil Watches</h2>
      <div class="result-view">
        <div class="product-card" v-for="(product, pid) in data" v-bind:key="pid">
          <div class="link" @click="openProductDetail(product._id)">
            <div
              class="img-cls"
              :style="getPictureStyle(product.thumbnailUrls[0])"
              v-if="product.thumbnailUrls.length > 0"
            ></div>

            <p v-else style="font-size: 5em; padding: 10px 0px; text-align: center; color: #bdbdbd">
              <font-awesome-icon icon="shopping-bag" width="100%"/>
            </p>
            <p>
              <strong>{{product.name}}</strong>
            </p>
            <p>{{product.price.currency}} {{product.price.amount}}</p>
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
        width: 'auto',
        height: '350px',
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

<style lang="scss" scoped>
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

  .link {
    cursor: pointer;
  }
  p {
    padding: 5px 30px;
    margin: 0px;
  }

  .img-cls {
    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
  }

  .add-cart-button {
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding: 10px 0px;
  }
}
</style>
