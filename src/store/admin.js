import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import axios from 'axios';

export default {
  namespaced: true,
  state: {
    products: [],
  },
  actions: {
    async deleteProduct({ dispatch }, id) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.deleteProduct,
          withCredentials: true,
          method: 'delete',
          data: {
            productId: id,
          },
        });
        console.log('Deleted');
        dispatch('getAllProducts');
      } catch (err) {
        console.log('err');
      }
    },
    async getAllProducts({ state, commit }) {
      try {
        const res = await axios({
          url: ProxyUrl.baseUrl + ProxyUrl.searchProduct,
          withCredentials: true,
          method: 'post',
          data: {
            searchFilters: {
              store: '',
              category: '',
            },
            pagingOptions: {
              page: 1,
              limit: 25,
            },
          },
        });
        // console.log(res.data.docs);
        commit('setProducts', res.data.docs);
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  mutations: {
    setProducts(state, payload) {
      // console.log(payload);
      state.products = [];
      state.products.push(...payload);
    },
  },
  getters: {
    allProducts(state) {
      console.log(state.products);
      return state.products;
    },
  },
};
