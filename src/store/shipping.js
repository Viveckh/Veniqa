import Vue from 'vue';
import ProxyUrls from '../constants/ProxyUrls';


export default {
  namespaced: true,
  state: {
    addresses: [],
  },

  mutations: {
    setAddresses(state, adds) {
      state.addresses.splice(0, state.addresses.length);
      state.addresses.push(adds);
    },
  },

  actions: {
    async addressAction({ state, commit }, { address, action }) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: action,
          url: ProxyUrls.addressUrl,
          data: action == 'get' ? null : address,
        });

        commit(setAddresses, data);
        return true;
      } catch (err) {
        return false;
      }
    },


  },

  getters: {
    allAddresses(state) {
      return state.addresses;
    },
  },
};
