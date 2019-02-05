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
  },

  mutations: {
    setSearchTerm(state, payload) {
      state.searchTerm = payload;
    },

    setListResult(state, payload) {
      state.listResult.splice(0, state.listResult.length);
      state.listResult.push(...payload);
    },
  },

  actions: {
    async searchForProduct({ state, commit, queryData }) {
      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrls.searchProduct,
          method: 'post',
          data: {
            category: "Men's Clothing",
            pagingOptions: state.paging,
          },
        });

        if (data && data.httpStatus == 200) {
          const transformed = [];
          data.responseData.docs.forEach((p) => {
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
    },
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
  },
};
