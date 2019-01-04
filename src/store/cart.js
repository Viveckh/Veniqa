import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import OrderDTO from '@/dto/Order.json';

export default {
  namespaced: true,
  state: {
    cart: [],
    total: {},
  },
  actions: {
    async addToTheCart({
      state,
      commit,
      rootGetters,
    }, products) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive'] && products.length > 0) {
        const foundIndex = _.findIndex(state.cart, pr => _.isEqual(pr.product, products[0]));

        if (Object.keys(state.total).length <= 0) {
          state.total = {
            amount: 0,
            currency: '',
          };
        }
        // Here the assumption currently is that only one product will be there everytime since everything is local.
        if (foundIndex >= 0) {
          const order = state.cart[foundIndex];
          order.counts = parseInt(order.counts) + 1;
          order.aggregatedPrice = {
            currency: order.aggregatedPrice.currency,
            amount: parseFloat(order.product.price.amount) + parseFloat(order.aggregatedPrice.amount),
          };
          if (state.total.currency.length == 0) {
            state.total.currency = order.aggregatedPrice.currency;
          }
        } else {
          const order = _.cloneDeep(OrderDTO);
          order.product = _.cloneDeep(products[0]);
          order.counts = 1;
          order.product_id = products[0]._id;
          order._id = state.cart.length;
          order.aggregatedPrice = {
            currency: products[0].price.currency,
            amount: products[0].price.amount,
          };

          state.cart.push(order);
        }

        commit('setLocalCart');
        return true;
      }

      const toSend = _.map(products, p => ({
        product: p._id,
        counts: p.counts == 0 ? 1 : p.counts,
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
      const deletedIds = _.map(cartItems, '_id');

      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        _.remove(state.cart, order => deletedIds.indexOf(order._id) >= 0);

        commit('setLocalCart');
        return;
      }

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
        const updatedItem = payloadArray.length > 0 ? payloadArray[0] : null;
        if (updatedItem) {
          updatedItem.aggregatedPrice.amount = parseInt(updatedItem.counts) * parseFloat(updatedItem.product.price.amount);
          updatedItem.aggregatedPrice.amount = updatedItem.aggregatedPrice.amount.toFixed(2);
          commit('setLocalCart');
          return true;
        }

        return false;
      }

      const orders = [];
      state.cart.forEach((item) => {
        orders.push({
          product: item.product._id,
          _id: item._id,
          counts: item.counts,
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
      state.total = {};
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
    setLocalCart(state) {
      state.cart = [...state.cart];

      let amount = 0; let
        currency = '';
      state.cart.forEach((item) => {
        amount += parseFloat(item.aggregatedPrice.amount);
        if (currency.length == 0) {
          currency = item.aggregatedPrice.currency;
        }
      });
      amount = amount.toFixed(2);
      state.total = {
        amount,
        currency,
      };
    },
    setCart(state, allCarts) {
      state.cart.splice(0, state.cart.length);
      const transformed = [];
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

    getTotalItems(state) {
      let total = 0;
      state.cart.forEach((item) => {
        total += parseInt(item.counts);
      });

      return total;
    },
  },
};
