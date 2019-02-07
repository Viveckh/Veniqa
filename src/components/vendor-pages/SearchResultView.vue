<template>
  <div id="search-result">
    <div class="search-result-view">
      <div class="result-view">
        <b-row class="text-center">
          <b-col></b-col>
          <b-col cols="10">
            <p class="align-left" v-if="title != 'Search Results'">Shop ▶ {{title}}</p>
            <p class="align-left" v-else>{{title}}</p>
            <hr>

            <div class="product-card align-left" v-for="(product, pid) in data" v-bind:key="pid">
              <div class="link" @click="openProductDetail(product._id)">
                <div class="img-parent" v-if="product.thumbnailUrls.length > 0">
                  <search-result-view-image :product="product"/>
                </div>

                <p
                  v-else
                  style="font-size: 5em; padding: 10px 0px; text-align: center; color: #bdbdbd"
                >
                  <font-awesome-icon icon="shopping-bag" width="100%"/>
                </p>
                <div class="product-card-desc">
                  <p class="info">{{product.store}}</p>
                  <p class="title">{{product.name}}</p>
                  <p>
                    <span
                      v-if="product.marked_price && product.marked_price.amount > product.price.amount"
                    >
                      <strong
                        class="underline"
                        style="color: red"
                      >{{product.marked_price.currency}} {{product.marked_price.amount}}</strong>&nbsp;&nbsp;
                    </span>

                    <strong>
                      <span>{{product.price.currency}} {{product.price.amount}}</span>
                    </strong>
                  </p>
                </div>
              </div>
              <!-- <b-button class="primary-button add-cart-button" @click="addToCart(product)">Add to Cart</b-button> -->
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import notification from '@/services/NotificationService';
import SearchResultViewImage from '@/components/vendor-pages/SearchResultViewImage';

export default {
  name: 'SearchResultView',
  props: {
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    SearchResultViewImage,
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
        const val = await this.$store.dispatch('cartStore/addToTheCart', [
          product,
        ]);
        if (val) {
          notification.success(this, `Added ${product.name} to the cart`);
        }
      } catch (err) {
        console.log('Error', err);
        // handle notification for different status here.
        notification.error(
          this,
          `${
            product.name
          } couldn't be added for some reason. Please try again later`,
        );
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

.result-view {
  margin-top: 1em;
}

.product-card {
  display: inline-block;
  // box-shadow: 3px 4px 5px 0px #ccc;
  // background-color: white;
  border-radius: 0.25rem;
  margin: 20px 20px 30px 0px;
  width: 270px;

  // &:hover .img-cls {
  //   transform: scale(1.2);
  //   transition: all 0.5s;
  // }

  .img-parent {
    height: 315px;
    width: 270px;
    overflow: hidden;
  }

  .product-card-desc {
    margin-top: 0.5em;
    .title {
      height: 2em;
      text-overflow: ellipsis;
      overflow: auto;
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

  // .img-cls {
  //   border-top-right-radius: 0.25rem;
  //   border-top-left-radius: 0.25rem;
  //   height: 100%;
  //   width: 100%;
  // }

  .add-cart-button {
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    padding: 10px 0px;
  }
}
</style>
