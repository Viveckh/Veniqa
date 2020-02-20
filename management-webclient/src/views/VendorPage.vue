<template>
  <div id="vendor">
    <div class="vendor-page-bg">
      <vendor-search :vendor="vendorName" @searchClicked="searchForProduct"></vendor-search>
    </div>

    <div id="searchResult">
      <search-result-view v-if="searchResult.length > 0" :data="searchResult"></search-result-view>
    </div>
  </div>
</template>

<script>
import VendorSearch from '@/components/vendor-pages/Vendor.vue';
import SearchResultView from '@/components/vendor-pages/SearchResultView.vue';
import ProxyUrls from '@/constants/ProxyUrls';
import ProductDTO from '@/dto/Products.json';

export default {
  name: 'VendorPage',
  props: {
    vendorName: {
      type: String,
      required: true,
    },
  },
  components: {
    VendorSearch,
    SearchResultView,
  },

  data() {
    return {
      vendorMap: {
        macys: "Macy's",
        amazon: 'Amazon',
        sephora: 'Sephora',
      },
      searchResult: [],
    };
  },

  methods: {
    async searchForProduct() {
      const res = await this.$axios({
        url: ProxyUrls.searchProduct,
        method: 'post',
        data: {
          store: this.vendorMap[this.vendorName],
          category: 'Make-Up',
        },
      });

      if (res) {
        this.searchResult.splice(0, this.searchResult.length);
        const transformed = [];

        res.data.forEach((p) => {
          transformed.push(_.assign(ProductDTO, p));
        });

        this.searchResult.push(...transformed);

        this.$scrollTo('#searchResult', 1000, {
          offset: -80,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.vendor-page-bg {
  background-image: url(../assets/images/amazon-bg.png);
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
