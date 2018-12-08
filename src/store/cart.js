import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import OrderDTO from '@/dto/Order.json'

export default {
  namespaced: true,
  state: {
    cart: [],
    total: {}
  },
  actions: {
    async addToTheCart({
      state,
      commit,
      rootGetters,
    }, products) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        const foundIndex = _.findIndex(state.cart, pr => pr.product_id === products.product_id);

        if (foundIndex >= 0) {
          state.cart[foundIndex].counts = parseInt(state.cart[foundIndex].counts) + 1;
        } else {
          products.counts = parseInt(products.counts) + 1;
          state.cart.push(products);
        }

        commit('setLocalCart', state.cart);
        return true;
      }

      let toSend = _.map(products, p => ({
        product_id: p._id,
        counts: p.counts == 0 ? 1 : p.counts
      }));

      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addToCart,
          method: 'post',
          data: toSend,
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
    }) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'get',
          url: ProxyUrl.getCart,
        });

        commit('setCart', data);
      } catch (err) {
        throw new Error(err);
      }
    },

    async deleteOrders({
      state,
      commit,
      rootGetters,
    }, cartItems) {
      const deletedIds = _.map(cartItems, 'additionalDetails._id');

      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      // if (!rootGetters['authStore/isSessionActive']) {
      //   _.remove(state.cart, product => deletedIds.indexOf(product._id) >= 0);

      //   commit('setLocalCart', state.cart);
      //   return;
      // }

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'delete',
          url: ProxyUrl.deleteCart,
          data: {
            cartItemIds: deletedIds,
          },
        });

        if (data) {
          commit('setCart', data);
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async updateOrders({
      state,
      commit,
      rootGetters,
    }, payloadArray) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        // These commits don't do anything but are necessary because they help persist.
        commit('setLocalCart', state.cart);
        return true;
      }

      const orders = [];
      state.cart.forEach((item) => {
        orders.push({
          product_id: item.additionalDetails.product_id,
          _id: item.additionalDetails._id,
          counts: item.additionalDetails.counts,
        });
      });

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'put',
          url: ProxyUrl.updateCart,
          data: {
            cartItems: orders,
          },
        });

        commit('setCart', data);
        return data;
      } catch (err) {
        console.log("Couldn't update the order");
        throw new Error(err);
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
    setCart(state, allCarts) {
      state.cart.splice(0, state.cart.length);
      let transformed = [];
      state.total = allCarts.totalPrice;
      allCarts.items.forEach((item) => {
        transformed.push(_.assign(_.cloneDeep(OrderDTO), item));
      });

      state.cart.push(...transformed);
    },
  },
  getters: {
    getCart(state) {
      return state.cart;
    },

    getTotal(state) {
      return state.total;
    },
  },
};
