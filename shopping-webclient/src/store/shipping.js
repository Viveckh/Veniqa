import Vue from 'vue';
import ProxyUrls from '../constants/ProxyUrls';

export default {
  namespaced: true,
  state: {
    addresses: [],
    selectedAddress: null,
    shippingMethod: null,
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

    resetAddresses(state) {
      state.shippingMethod = null;
      state.addresses = [];
      state.selectedAddress = null;
    },
  },

  actions: {
    async addressAction({
      state, commit, rootGetters, dispatch,
    }, { address, action }) {
      try {
        let reqData = null;
        if (action === 'post' || action === 'put') {
          reqData = address;
        } else if (action === 'delete') {
          reqData = {
            addressId: address._id,
          };
        }
        const { data } = await Vue.prototype.$axios({
          method: action,
          url: ProxyUrls.address, // ProxyUrls.addressUrl,
          data: reqData,
        });
        if (rootGetters['cartStore/checkoutInitiated'] && action !== 'get') {
          const reqObj = {
            address: state.selectedAddress,
            shippingMethod: state.shippingMethod,
          };
          await dispatch('cartStore/createCheckout', reqObj, {
            root: true,
          });
        } else if (data && data.httpStatus === 200) {
          commit('setAddresses', data.responseData);
          console.log(
            'Index is ',
            _.findIndex(state.addresses, val => val._id === state.selectedAddress._id),
          );
          if (
            (state.selectedAddress === null
              || _.findIndex(state.addresses, val => val._id === state.selectedAddress._id) < 0)
            && state.addresses.length > 0
          ) {
            commit('addressSelected', state.addresses[0]);
            console.log('Address selected', state.selectedAddress);
          }
        }
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
      return state.shippingMethods;
    },
  },
};
