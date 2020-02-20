import _ from 'lodash';
import ProductDTO from '@/dto/Products.json';
import ProxyUrls from '@/constants/ProxyUrls';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    searchTerm: '',
    searchResult: []
  },

  mutations: {
    setSearchTerm(state, payload) {
      state.searchTerm = payload;
    },

    setSearchResult(state, payload) {
      // state.searchResult.splice(0, state.searchResult.length);
      state.searchResult.push(...payload);
    },

    resetStore(state) {
      state.searchResult = [];
    }
  },

  actions: {
    async searchForProduct({ commit }, payload) {
      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrls.searchProduct,
          method: 'post',
          data: {
            searchTerm: payload.term,
            categoryIds: payload.subcategories,
            pagingOptions: payload.paging
          }
        });

        if (data && data.httpStatus === 200) {
          const transformed = [];
          data.responseData.docs.forEach(p => {
            transformed.push(_.assign(_.cloneDeep(ProductDTO), p));
          });

          commit('setSearchResult', transformed);
          return {
            total: data.responseData.total,
            pages: data.responseData.pages
          };
        }
        throw new Error('result error');
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

    searchResult(state) {
      return state.searchResult;
    }
  }
};
