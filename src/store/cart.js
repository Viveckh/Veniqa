import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';


export default {
  namespaced: true,
  state: {
    cart: [],
  },
  actions: {
    async addToTheCart({
      state,
      commit,
      rootGetters,
    }, payload) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        const foundIndex = _.findIndex(state.cart, pr => pr._id === payload._id);

        if (foundIndex >= 0) {
          state.cart[foundIndex].counts += 1;
        } else {
          payload.counts += 1;
          state.cart.push(payload);
        }

        commit('setLocalCart', state.cart);
        return true;
      }

      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addToCart,
          method: 'post',
          data: {
            product_id: payload._id,
          },
        });

        commit('setCart', res.data);
        return true;
      } catch (err) {
        return false;
      }
    },

    async getCart({
      state,
      commit,
      dispatch,
    }, append) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'get',
          url: ProxyUrl.getCart,
        });

        if (append) {
          commit('appendToCart', data);
          dispatch('updateOrders');
        } else {
          commit('setCart', data);
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async deleteOrders({
      state,
      commit,
      rootGetters,
    }, products) {
      const deletedIds = _.map(products, '_id');

      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        _.remove(state.cart, product => deletedIds.indexOf(product._id) >= 0);

        commit('setLocalCart', state.cart);
        return;
      }
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'delete',
          url: ProxyUrl.deleteCart,
          data: {
            productIds: deletedIds,
          },
        });

        if (data) {
          commit('deleteProduct', deletedIds);
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async updateOrders({
      state,
      commit,
      rootGetters,
    }) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        // These commits don't do anything but are necessary because they help persist.
        commit('setLocalCart', state.cart);
        return true;
      }
      const orders = _.map(state.cart, c => ({
        product_id: c._id,
        counts: c.counts,
      }));

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'put',
          url: ProxyUrl.updateCart,
          data: orders,
        });

        commit('setCart', data);
      } catch (err) {
        console.log("Couldn't update the order");
      }
    },
  },
  mutations: {
    resetOrders(state) {
      state.cart = [];
    },
    appendToCart(state, newProducts) {
      newProducts.forEach((pr) => {
        const ind = _.findIndex(state.cart, {
          _id: pr._id,
        });

        if (ind < 0) {
          const temp = pr.product;
          temp.counts = pr.counts;
          state.cart.push(temp);
        }
      });
    },
    setLocalCart(state, products) {
      state.cart = [...state.cart];
    },
    setCart(state, allProducts) {
      state.cart.splice(0, state.cart.length);
      const transformed = [];
      allProducts.forEach((pr) => {
        const temp = pr.product;
        temp.counts = pr.counts;
        transformed.push(temp);
      });
      state.cart.push(...transformed);
    },

    deleteProduct(state, productIds) {
      _.remove(state.cart, c => productIds.indexOf(c._id) >= 0);

      state.cart = [...state.cart];
    },
  },
  getters: {
    getCart(state) {
      return state.cart;
    },
  },
};
