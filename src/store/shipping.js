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
      state.addresses.push(...adds);
    },
  },

  actions: {
    async addressAction({ state, commit }, { address, action }) {
      try {
        let reqData = null;
        if (action == 'post' || action == 'put') {
          reqData = address;
        } else if (action == 'delete') {
          reqData = {
            addressId: address._id,
          };
        }
        const { data } = await Vue.prototype.$axios({
          method: action,
          url: ProxyUrls.address, // ProxyUrls.addressUrl,
          data: reqData,
        });
        commit('setAddresses', data.responseData);
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
