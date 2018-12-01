<template>
  <div id="amazon">

    <div class="amazon-page-bg">
      <amazon @searchClicked="searchForProduct"/>
    </div>
    <div id="searchResult">
      <search-result-view
      v-if="searchResult.length > 0"
      :data="searchResult"
    ></search-result-view>
    </div>

  </div>
</template>

<script>
import Amazon from '@/components/vendor-pages/amazon/Amazon.vue';
import SearchResultView from '@/components/SearchResultView.vue';
import Axios from 'axios';

export default {
  name: 'AmazonPage',
  components: {
    Amazon,
    SearchResultView,
  },
  data() {
    return {
      searchResult: [],
    };
  },

  methods: {
    async searchForProduct(searchTerm) {
      const { data } = await Axios.get('AmazonSearchResult.json');

      if (data) {
        this.searchResult.splice(0, this.searchResult.length);
        this.searchResult.push(...data);

        this.$scrollTo('#searchResult', 1000, {
          offset: -80,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.amazon-page-bg{
  background-image: url(../assets/images/amazon-bg.png);
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}


</style>
