import _ from 'lodash';
import ProxyUrls from '@/constants/ProxyUrls';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    categories: [],
    subCategories: [],
  },

  mutations: {
    setCategories(state, payload) {
      state.categories = payload;
    },

  },

  actions: {
    async getData({
      state,
      commit,
    }, payload) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrls.categoriesUrl,
          method: 'get',
        });

        if (data && data.httpStatus == 200) {
          const groups = _.mapValues(_.groupBy(data.responseData, 'category'), clist => clist.map(category => _.omit(category, 'category')));
          commit('setCategories', groups);
        }
        return false;
      } catch (err) {
        console.log('Error', err);
        throw err;
      }
    },
  },

  getters: {
    getCategories(state) {
      return state.categories;
    },
  },
};
