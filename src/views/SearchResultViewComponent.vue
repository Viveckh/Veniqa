<template>
  <div id="search-result-view">
    <div class="space"></div>
    <search-result-view :data="searchResult" :title="pageName"/>
  </div>
</template>

<script>
import _ from 'lodash';
import PagingOption from '@/dto/Pagination';
import { mapGetters } from 'vuex';
import notification from '@/services/NotificationService';
import SearchResultView from '@/components/vendor-pages/SearchResultView';

export default {
  data() {
    return {
      pageName: 'Search Results',
    };
  },
  name: 'SearchResultViewComponent',
  props: {
    query: {
      type: [String, Object],
    },
  },
  components: {
    SearchResultView,
  },

  created() {
    this.searchForProduct();
  },

  watch: {
    searchTerm() {
      this.searchForProduct();
    },
  },

  methods: {
    async searchForProduct() {
      try {
        const isSuccess = await this.$store.dispatch(
          'searchStore/searchForProduct',
        );
      } catch (error) {
        notification.error(
          this,
          'Coudnt get the search result because the server went haywire',
        );
      }
    },
  },

  computed: {
    ...mapGetters({
      searchTerm: 'searchStore/searchTerm',
      paging: 'searchStore/paging',
      searchResult: 'searchStore/searchResult',
    }),
  },
};
</script>

<style lang="scss">
#search-result-view {
  min-height: 50vh;
}
</style>
