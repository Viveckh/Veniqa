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
import VendorSearch from "@/components/vendor-pages/Vendor";
import axios from "axios";
import SearchResultView from '@/components/SearchResultView.vue';

export default {
  name: "VendorPage",
  props: {
    vendorName: {
      type: String,
      required: true
    }
  },
  components: {
    VendorSearch,
    SearchResultView
  },

  data() {
    return {
      vendorMap: {
        macys: "Macy's",
        amazon: "Amazon"
      },
      searchResult: []
    };
  },

  methods: {
    async searchForProduct(searchTerm) {
      const res = await axios({
        withCredentials: true,
        url: "https://veniqa.azurewebsites.net/catalog/search",
        method: 'post',
        data: {
          store: this.vendorMap[this.vendorName],
          category: "Make-Up"
        }
      });

      if (res) {
        this.searchResult.splice(0, this.searchResult.length);
        this.searchResult.push(...res.data);

        this.$scrollTo("#searchResult", 1000, {
          offset: -80
        });
      }
    }
  }
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
