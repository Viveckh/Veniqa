<template>
  <div class="product-detail">
    <div class="space"></div>

    <p class="align-left">Shop &nbsp; > &nbsp; {{title}}</p>
    <hr>
    <b-row>
      <b-col md="2" class="beginner align-left">
        <div>
          <side-menu-view :sidebar="categories"></side-menu-view>
        </div>
      </b-col>
      <b-col md="10" class="align-left">
        <div class="product-card align-left" v-for="(product, pid) in data" v-bind:key="pid">
          <div class="link" @click="openProductDetail(product._id)">
            <div class="img-parent" v-if="product.thumbnailUrls.length > 0">
              <search-result-view-image :product="product"/>
            </div>

            <p v-else style="font-size: 5em; padding: 10px 0px; text-align: center; color: #bdbdbd">
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
</template>


<script>
import SearchResultViewImage from '@/components/vendor-pages/SearchResultViewImage.vue';
import SideMenuView from '@/components/vendor-pages/SideMenuView.vue';

export default {
  name: 'SearchResultView',
  data() {
    return {
      categories: null
    };
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  components: {
    SearchResultViewImage,
    SideMenuView
  },

  created() {
    console.log(this.$store.getters['listStore/getCategories']);
    this.categories = this.$store.getters['listStore/getCategories'];
  },

  methods: {
    getPictureStyle(img) {
      return {
        'background-image': `url(${img})`,
        'background-size': 'cover',
        // width: 'auto',
        // height: '350px',
        'margin-bottom': '10px'
      };
    },

    openProductDetail(pid) {
      this.$router.push(`/products/${pid}`);
    }
  }
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
  border-radius: 0px;
  margin: 20px 20px 30px 0px;
  width: 300px;

  // &:hover .img-cls {
  //   transform: scale(1.2);
  //   transition: all 0.5s;
  // }

  .img-parent {
    height: 315px;
    width: 300px;
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
}

.product-detail {
  width: 80%;
  margin: auto;
  margin-bottom: 10px;
}
</style>
