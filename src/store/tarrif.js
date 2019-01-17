import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import axios from 'axios';
import * as _ from 'lodash';

export default {
  namespaced: true,
  state: {
    tarrifs: [],
  },

  actions: {
    
    async getTarrifs({ commit }) {
      try {
        const res = await axios({
          url: ProxyUrl.baseUrl + ProxyUrl.allTarrifs,
          withCredentials: true,
          method: 'get',
          data: {},
        });
        console.log("Tarrifs", res.data.responseData);
        commit('setTarrifs', res.data.responseData);
      } catch (err) {
        throw new Error(err);
      }
    },
    async addTarrif({ dispatch }, tarrif) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addTarrif,
          withCredentials: true,
          method: 'post',
          data: tarrif,
        });
        dispatch('getTarrifs');
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async editTarrif({ dispatch }, tarrif) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.editTarrif,
          withCredentials: true,
          method: 'put',
          data: tarrif,
        });

        dispatch('getTarrifs');
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
   
  },
  mutations: {
  
    setTarrifs(state, payload) {
      state.tarrifs = payload;
      console.log("Here", state.tarrifs);
    },
  },
  getters: {
   
    gettarrifs(state) {
      return state.tarrifs;
    },
  },
};

// (_.find(refDataPayload.product_categories, {name: 'category'})).sub_categories
