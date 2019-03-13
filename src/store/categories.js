import _ from 'lodash';
import ProxyUrls from '@/constants/ProxyUrls';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    categories: {},
    masterList: [],
  },

  mutations: {
    setCategories(state, payload) {
      state.categories = payload;
    },

    setMasterList(state, payload) {
      state.masterList = payload;
    },
  },

  actions: {
    async getCategoriesData({ commit }) {
      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrls.categoriesUrl,
          method: 'get',
        });

        if (data && data.httpStatus === 200) {
          const groups = _.mapValues(_.groupBy(data.responseData, 'category'));
          console.log('Categories Data', groups);
          commit('setCategories', groups);
          commit('setMasterList', data.responseData);
        }
        return false;
      } catch (err) {
        console.log('Error', err);
        throw err;
      }
    },
  },

  getters: {
    categories(state) {
      return state.categories;
    },

    masterList(state) {
      return state.masterList;
    },
  },
};
