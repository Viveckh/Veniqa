import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import axios from 'axios';
import * as _ from 'lodash';

export default {
  namespaced: true,
  state: {
    categorys: [],
  },

  actions: {

    async getCategorys({
      commit,
    }) {
      try {
        const res = await axios({
          url: ProxyUrl.baseUrl + ProxyUrl.allCategories,
          withCredentials: true,
          method: 'get',
          data: {},
        });
        console.log('Categorys', res.data.responseData);
        commit('setCategorys', res.data.responseData);
      } catch (err) {
        throw new Error(err);
      }
    },
    async addCategory({
      dispatch,
    }, category) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addCategory,
          withCredentials: true,
          method: 'post',
          data: category,
        });
        dispatch('getCategorys');
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async editCategory({
      dispatch,
    }, category) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.editCategory,
          withCredentials: true,
          method: 'put',
          data: category,
        });

        dispatch('getCategorys');
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

  },
  mutations: {

    setCategorys(state, payload) {
      state.categorys = payload;
      console.log('Here', state.categorys);
    },
  },
  getters: {

    getcategorys(state) {
      return state.categorys;
    },
  },
};

// (_.find(refDataPayload.product_categories, {name: 'category'})).sub_categories
