import _ from 'lodash';
import PagingOption from '@/dto/Pagination.json';
import ProductDTO from '@/dto/Products.json';
import ProxyUrls from '@/constants/ProxyUrls';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    searchTerm: '',
    paging: _.cloneDeep(PagingOption),
    listResult: [],
    categories: [],
    subCategoriesMen: [],
    subCategoriesWomen: []
  },

  mutations: {
    setSearchTerm(state, payload) {
      state.searchTerm = payload;
    },
    setCategories(state, payload) {
      state.categories = payload;
      state.subCategoriesMen = _.map(payload.Men, '_id');
      state.subCategoriesWomen = _.map(payload.Women, '_id');
    },

    setListResult(state, payload) {
      state.listResult.splice(0, state.listResult.length);
      state.listResult.push(...payload);
    }
  },

  actions: {
    async getCategoriesData({ commit }) {
      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrls.categoriesUrl,
          method: 'get'
        });

        if (data && data.httpStatus === 200) {
          const groups = _.mapValues(_.groupBy(data.responseData, 'category'));
          console.log('Categories Data', groups);
          commit('setCategories', groups);
        }
        return false;
      } catch (err) {
        console.log('Error', err);
        throw err;
      }
    },
    async searchForProduct({ state, commit }, payload) {
      if (payload === 'Men') {
        payload = state.subCategoriesMen;
      } else if (payload === 'Women') {
        payload = state.subCategoriesWomen;
      } else {
        payload = [payload];
      }
      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrls.searchProduct,
          method: 'post',
          data: {
            categoryIds: payload,
            pagingOptions: state.paging
          }
        });

        if (data && data.httpStatus === 200) {
          const transformed = [];
          data.responseData.docs.forEach(p => {
            transformed.push(_.assign(_.cloneDeep(ProductDTO), p));
          });

          commit('setListResult', transformed);
          return true;
        }
        return false;
      } catch (err) {
        console.log('Error', err);
        throw err;
      }
    }
  },

  getters: {
    searchTerm(state) {
      return state.searchTerm;
    },

    paging(state) {
      return state.paging;
    },

    listResult(state) {
      return state.listResult;
    },
    getCategories(state) {
      console.log('Type of Value Returned', typeof state.categories);
      return state.categories;
    }
  }
};
