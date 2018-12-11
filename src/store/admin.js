import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import axios from 'axios';
import * as _ from 'lodash';

export default {
  namespaced: true,
  state: {
    products: [],
    stores: [],
    categories: [],
    subcategories: [],
    refDataPayload: [],
  },

  actions: {
    async getReferenceData({ commit }) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.refData,
          withCredentials: true,
          method: 'get',
          data: {},
        });
        // console.log(res);
        commit('setRefData', res.data);
      } catch (err) {
        console.log(err);
      }
    },
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
        // console.log('Deleted');
        dispatch('getAllProducts');
      } catch (err) {
        console.log(err);
      }
    },
    async addProduct({ dispatch }, product) {
      // console.log(product);
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addProduct,
          withCredentials: true,
          method: 'post',
          data: product,
        });
        // console.log(res);
        dispatch('getAllProducts');
      } catch (err) {
        console.log(err);
      }
    },
    async getAllProducts({ commit }) {
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
    setRefData(state, payload) {
      state.stores = payload.stores || [];
      state.categories = [];
      state.weight_units = payload.weight_units || [];
      state.categories = _.map(payload.product_categories, 'name');
      state.refDataPayload = payload || {};
      state.subcategories = [];
      // console.log(state);
    },
  },
  getters: {
    allProducts(state) {
      // console.log(state.products);
      return state.products;
    },
    allStateData(state) {
      console.log('Returned State: ', state);
      return state;
    },
  },
};

// (_.find(refDataPayload.product_categories, {name: 'category'})).sub_categories
