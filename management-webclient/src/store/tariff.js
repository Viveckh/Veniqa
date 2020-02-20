import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';

export default {
  namespaced: true,
  state: {
    tariffs: [],
  },

  actions: {

    async getTariffs({
      commit,
    }) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.allTariffs,
          withCredentials: true,
          method: 'get',
          data: {},
        });
        commit('setTariffs', res.data.responseData);
      } catch (err) {
        throw new Error(err);
      }
    },
    async addTariff({
      dispatch,
    }, tariff) {
      try {
        await Vue.prototype.$axios({
          url: ProxyUrl.addTariff,
          withCredentials: true,
          method: 'post',
          data: tariff,
        });
        dispatch('getTariffs');
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async editTariff({
      dispatch,
    }, tariff) {
      try {
        await Vue.prototype.$axios({
          url: ProxyUrl.editTariff,
          withCredentials: true,
          method: 'put',
          data: tariff,
        });

        dispatch('getTariffs');
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

  },
  mutations: {

    setTariffs(state, payload) {
      state.tariffs = payload;
    },
  },
  getters: {

    gettariffs(state) {
      return state.tariffs;
    },
  },
};

// (_.find(refDataPayload.product_categories, {name: 'category'})).sub_categories
