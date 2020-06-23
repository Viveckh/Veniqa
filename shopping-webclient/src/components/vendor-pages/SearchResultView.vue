<template>
  <div class="product-detail">
    <div class="space"></div>
    <br>
    <p class="align-left bcrumb">Shop &nbsp; / &nbsp; {{title}}</p>
    <br>
    <b-row>
      <b-col md="2" class="beginner align-left">
        <div class="d-none d-md-block">
          <side-menu-view
            :sidebar="menu"
            :category="category"
            :subCategory="subCategory"
            :term="term"
          ></side-menu-view>
        </div>
      </b-col>
      <b-col md="10">
        <div v-if="data && data.length > 0">
          <div class="product-card align-center" v-for="(product, pid) in data" v-bind:key="pid">
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
          </div>
          <div class="align-center">
            <b-btn
              class="primary-button"
              @click="loadMoreProducts()"
              v-show="data.length < paging.total"
            >See More</b-btn>
          </div>
        </div>
        <div v-else>
          <div class="info" style="font-size: 50px">No result found ...</div>
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
  props: {
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    menu: {
      required: true,
    },
    term: {
      required: false,
      default: '',
      type: String,
    },

    category: {
      required: false,
      default: '',
      type: String,
    },

    subCategory: {
      required: false,
      default: '',
      type: String,
    },

    paging: {
      required: false,
      default: null,
      type: Object,
    },
  },
  components: {
    SearchResultViewImage,
    SideMenuView,
  },

  methods: {
    getPictureStyle(img) {
      return {
        'background-image': `url(${img})`,
        'background-size': 'cover',
        'margin-bottom': '10px',
      };
    },

    openProductDetail(pid) {
      this.$router.push(`/products/${pid}`);
    },

    loadMoreProducts() {
      this.$emit('nextpage');
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
  border-radius: 0px;
  margin: 20px 20px 30px 0px;
  width: 225px;

  // &:hover .img-cls {
  //   transform: scale(1.2);
  //   transition: all 0.5s;
  // }

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
.bcrumb {
  font-size: 0.75em;
}
.product-detail {
  width: 90%;
  margin-left: auto;
  margin-right: auto;

  margin-bottom: 10px;
}
</style>
