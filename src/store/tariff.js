import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import axios from 'axios';
import * as _ from 'lodash';

export default {
  namespaced: true,
  state: {
    tariffs: [],
  },

  actions: {
    
    async getTariffs({ commit }) {
      try {
        const res = await axios({
          url: ProxyUrl.baseUrl + ProxyUrl.allTariffs,
          withCredentials: true,
          method: 'get',
          data: {},
        });
        console.log("Tariffs", res.data.responseData);
        commit('setTariffs', res.data.responseData);
      } catch (err) {
        throw new Error(err);
      }
    },
    async addTariff({ dispatch }, tariff) {
      try {
        const res = await Vue.prototype.$axios({
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
    async editTariff({ dispatch }, tariff) {
      try {
        const res = await Vue.prototype.$axios({
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
      console.log("Here", state.tariffs);
    },
  },
  getters: {
   
    gettariffs(state) {
      return state.tariffs;
    },
  },
};

// (_.find(refDataPayload.product_categories, {name: 'category'})).sub_categories
