import Vue from 'vue';
import ProxyUrls from '../constants/ProxyUrls';


export default {
  namespaced: true,
  state: {
    addresses: [],
    selectedAddress: null,
    shippingMethod: null
  },

  mutations: {
    setAddresses(state, adds) {
      state.addresses.splice(0, state.addresses.length);
      state.addresses.push(...adds);
    },

    addressSelected(state, address) {
      state.selectedAddress = address;
    },

    setShippingMethod(state, payload) {
      state.shippingMethod = payload;
    },
  },

  actions: {
    async addressAction({
      state,
      commit,
      getters
    }, {
      address,
      action
    }) {

      try {
        let reqData = null;
        if (action == 'post' || action == 'put') {
          reqData = address;
        } else if (action == 'delete') {
          reqData = {
            addressId: address._id,
          };
        }
        const {
          data
        } = await Vue.prototype.$axios({
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

    getSelectedAddress(state) {
      return state.selectedAddress;
    },

    shippingMethod(state) {
      return state.shippingMethod;
    },

    shippingMethods(state) {
      return state.shippingMethods
    }
  },
};
