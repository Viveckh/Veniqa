<template>
  <div id="search">
    <search-result-view
      :data="searchResult"
      :title="'Search Result'"
      :menu="categories"
      :term="term"
      :category="category"
      :subCategory="subCategory"
      :paging="paging"
      @nextpage="loadMoreData"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SearchResultView from '@/components/vendor-pages/SearchResultView.vue';
import PagingOption from '@/dto/Pagination.json';

export default {
  name: 'SearchView',
  components: {
    SearchResultView,
  },
  data() {
    return {
      term: '',
      category: '',
      subCategory: '',
      paging: _.cloneDeep(PagingOption),
    };
  },

  watch: {
    // eslint-disable-next-line
    '$route.query': function (value) {
      this.assignQueryValues(value);
    },
  },

  async created() {
    await this.$store.dispatch('categoryStore/getCategoriesData');

    this.assignQueryValues(this.$route.query);
  },

  methods: {
    assignQueryValues(value) {
      if (value.category) this.category = value.category;
      else this.category = '';

      if (value.subCategory) this.subCategory = value.subCategory;
      else this.subCategory = '';

      if (value.term) this.term = value.term;
      else this.term = '';

      this.$store.commit('searchStore/resetStore');
      this.paging.page = 1;

      this.performSearch();
    },

    async performSearch() {
      const payload = {};

      payload.term = this.term;

      if (this.category.length > 0 && this.subCategory.length > 0) {
        payload.subcategories = _.map(
          _.filter(
            this.masterCategoryList,
            v => v.subcategory === this.subCategory && v.category === this.category,
          ),
          '_id',
        );
      } else if (this.subCategory.length > 0) {
        payload.subcategories = _.map(
          _.filter(
            this.masterCategoryList,
            v => v.subcategory === this.subCategory,
          ),
          '_id',
        );
      } else if (this.category.length > 0) {
        payload.subcategories = _.map(this.categories[this.category], '_id');
      }

      payload.paging = this.paging;

      const pageResp = await this.$store.dispatch(
        'searchStore/searchForProduct',
        payload,
      );

      _.assign(this.paging, pageResp);
    },

    loadMoreData() {
      this.paging.page += parseInt(1);

      this.performSearch();
    },
  },

  computed: {
    ...mapGetters({
      categories: 'categoryStore/categories',
      masterCategoryList: 'categoryStore/masterList',
      searchResult: 'searchStore/searchResult',
    }),
  },
};
</script>

<style lang="scss">
#search {
}
</style>
