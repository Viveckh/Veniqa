import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import OrderDTO from '@/dto/Order.json';

export default {
  namespaced: true,
  state: {
    cart: [],
    totalPrice: {},
    totalWeight: {},
    subTotalPrice: {},
    serviceCharge: {},
    shippingPrice: {},
    tariffPrice: {},
    checkoutInitiated: false,
    checkoutID: null
  },
  actions: {
    /**
     *This is temporary
     *
     * @param {*} { state }
     */
    async pay({ state, commit }) {
      console.log('pay in cart');
      const { data } = await Vue.prototype.$axios({
        url: ProxyUrl.createPaymentToken,
        method: 'post',
        data: {
          checkoutId: state.checkoutID,
          paymentSource: 'NONE'
        }
      });

      if (data.httpStatus === 200) {
        const paymentId = data.responseData.payment_info[0].payment_id;

        const newData = await Vue.prototype.$axios({
          url: ProxyUrl.completeCheckout,
          method: 'post',
          data: {
            paymentSource: 'NONE',
            paymentId
          }
        });

        if (newData.data.httpStatus === 200) {
          commit('resetOrders');
        }
      }
    },
    async createCheckout({ commit }, { address, shippingMethod }) {
      const reqData = {
        shippingMethod: shippingMethod._id,
        addressId: address._id
      };
      try {
        console.log('createCheckout');
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrl.createCheckout,
          method: 'post',
          data: reqData
        });

        if (data.httpStatus === 200) {
          commit('setCart', data.responseData.cart);
          commit('setCheckoutInitiated', true);
          commit('setCheckoutId', data.responseData._id);
          return true;
        }
        commit('setCheckoutInitiated', false);
        commit('setCheckoutId', null);
        throw new Error(data.httpStatus);
      } catch (err) {
        throw new Error(err);
      }
    },

    async addToTheCart({
      state, commit, dispatch, rootGetters
    }, products) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive'] && products.length > 0) {
        console.log('Add to cart is not possible because you are not logged in');
        return;
        // const foundIndex = _.findIndex(state.cart, pr => _.isEqual(pr.product, products[0]));

        // if (Object.keys(state.total).length <= 0) {
        //   state.total = {
        //     amount: 0,
        //     currency: '',
        //   };
        // }
        // // Here the assumption currently is that only one product will be there everytime since everything is local.
        // if (foundIndex >= 0) {
        //   const order = state.cart[foundIndex];
        //   order.counts = parseInt(order.counts) + 1;
        //   order.aggregatedPrice = {
        //     currency: order.aggregatedPrice.currency,
        //     amount:
        //       parseFloat(order.product.price.amount) + parseFloat(order.aggregatedPrice.amount),
        //   };
        //   if (state.total.currency.length == 0) {
        //     state.total.currency = order.aggregatedPrice.currency;
        //   }
        // } else {
        //   const order = _.cloneDeep(OrderDTO);
        //   order.product = _.cloneDeep(products[0]);
        //   order.counts = 1;
        //   order.product_id = products[0]._id;
        //   order._id = state.cart.length;
        //   order.aggregatedPrice = {
        //     currency: products[0].price.currency,
        //     amount: products[0].price.amount,
        //   };

        //   state.cart.push(order);
        // }

        // commit('setLocalCart');
        // return true;
      }

      console.log('Products', products);
      const toSend = _.map(products, p => ({
        product: p._id,
        counts: p.counts === 0 ? 1 : p.counts,
        customizations: p.customValues ? p.customValues : null
      }));

      console.log('To send', toSend);

      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrl.addToCart,
          method: 'post',
          data: toSend
        });

        if (data.httpStatus === 200) {
          if (state.checkoutInitiated) {
            const reqObj = {
              address: rootGetters['shippingStore/getSelectedAddress'],
              shippingMethod: rootGetters['shippingStore/shippingMethod']
            };

            await dispatch('createCheckout', reqObj);
            // eslint-disable-next-line consistent-return
            return true;
          }
          commit('setCart', data.responseData);
          // eslint-disable-next-line consistent-return
          return true;
        }
        throw new Error(data.httpStatus);
      } catch (err) {
        console.log('Error adding', err);
        console.log('More', err.message);
        throw new Error(err);
      }
    },

    async getCart({
      commit
    }) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'get',
          url: ProxyUrl.getCart
        });
        if (data.httpStatus === 200) {
          commit('setCart', data.responseData);
        } else throw new Error(data.httpStatus);
      } catch (err) {
        throw new Error(err);
      }
    },

    async deleteOrders({
      state, commit, rootGetters, dispatch
    }, cartItems) {
      const deletedIds = _.map(cartItems, '_id');

      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        _.remove(state.cart, order => deletedIds.indexOf(order._id) >= 0);

        commit('setLocalCart');
        return;
      }

      try {
        const { data } = await Vue.prototype.$axios({
          method: 'delete',
          url: ProxyUrl.deleteCart,
          data: {
            cartItemIds: deletedIds
          }
        });

        if (data.httpStatus === 200) {
          if (state.checkoutInitiated) {
            const reqObj = {
              address: rootGetters['shippingStore/getSelectedAddress'],
              shippingMethod: rootGetters['shippingStore/shippingMethod']
            };

            await dispatch('createCheckout', reqObj);
          } else {
            console.log('Getting all cart vals');
            commit('setCart', data.responseData);
          }
        }
      } catch (err) {
        console.log('Error getting cart', err);
        console.log('More', err.message);
        throw new Error(err);
      }
    },

    async updateOrders({
      state, commit, dispatch, rootGetters
    }, payloadArray) {
      // Checks if the session is active. If not, it means that the user is not logged in. So, just do things locally.
      if (!rootGetters['authStore/isSessionActive']) {
        // These commits don't do anything but are necessary because they help persist.
        // const updatedItem = payloadArray.length > 0 ? payloadArray[0] : null;
        // if (updatedItem) {
        //   updatedItem.aggregatedPrice.amount = parseInt(updatedItem.counts) * parseFloat(updatedItem.product.price.amount);
        //   updatedItem.aggregatedPrice.amount = updatedItem.aggregatedPrice.amount.toFixed(2);
        //   commit('setLocalCart');
        //   return true;
        // }

        // return false;

        console.log('Cannot send the request because the user is not logged in');
        return;
      }

      console.log('Payload array', payloadArray);

      const orders = [];
      state.cart.forEach(item => {
        console.log('Count', item.counts);
        orders.push({
          product: item.product._id,
          _id: item._id,
          counts: item.counts,
          customizations: item.customizations
        });
      });

      console.log('Orders', orders);
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'put',
          url: ProxyUrl.updateCart,
          data: {
            cartItems: orders
          }
        });

        if (data.httpStatus === 200) {
          if (state.checkoutInitiated) {
            const reqObj = {
              address: rootGetters['shippingStore/getSelectedAddress'],
              shippingMethod: rootGetters['shippingStore/shippingMethod']
            };

            await dispatch('createCheckout', reqObj);
          } else {
            console.log('Setting cart after successful update');
            commit('setCart', data.responseData);
            return data;
          }
        } else {
          throw new Error(data.httpStatus);
        }
      } catch (err) {
        console.log('Error getting cart', err);
        console.log('More', err.message);
        throw new Error(err);
      }
    }
  },
  mutations: {
    setCheckoutId(state, payload) {
      state.checkoutID = payload;
    },
    setCheckoutInitiated(state, val) {
      state.checkoutInitiated = val;
    },
    resetOrders(state) {
      state.cart = [];
      state.totalWeight = {};
      state.subTotalPrice = {};

      state.totalPrice = {};
      state.serviceCharge = {};
      state.shippingPrice = {};
      state.tariffPrice = {};
      state.checkoutInitiated = false;
      state.checkoutID = null;
    },
    appendToCart(state, newProducts) {
      newProducts.forEach(pr => {
        const ind = _.findIndex(state.cart, {
          _id: pr._id
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

      let amount = 0;
      let curr = '';
      state.cart.forEach(item => {
        amount += parseFloat(item.aggregatedPrice.amount);
        if (curr.length === 0) {
          const { aggregatedPrice: currency } = item;
          curr = currency;
        }
      });
      amount = amount.toFixed(2);
      state.total = {
        amount,
        curr
      };
    },
    setCart(state, allCarts) {
      state.cart.splice(0, state.cart.length);
      const transformed = [];
      state.totalWeight = allCarts.totalWeight;
      state.subTotalPrice = allCarts.subTotalPrice;

      state.totalPrice = allCarts.totalPrice ? allCarts.totalPrice : null;
      state.serviceCharge = allCarts.serviceCharge ? allCarts.serviceCharge : null;
      state.shippingPrice = allCarts.shippingPrice ? allCarts.shippingPrice : null;
      state.tariffPrice = allCarts.tariffPrice ? allCarts.tariffPrice : null;

      // allCarts.items.forEach((item) => {
      for (let i = 0; i < allCarts.items.length; i += 1) {
        const item = allCarts.items[i];
        transformed.push(_.assign(_.cloneDeep(OrderDTO), item));
      }

      state.cart.push(...transformed);
    }
  },
  getters: {
    getCart(state) {
      return state.cart;
    },

    getTotal(state) {
      return state.totalPrice;
    },

    getTotalItems(state) {
      let total = 0;
      state.cart.forEach(item => {
        total += parseInt(item.counts);
      });

      return total;
    },

    getTotalWeight(state) {
      return state.totalWeight;
    },

    getSubTotal(state) {
      return state.subTotalPrice;
    },
    getServiceCharge(state) {
      return state.serviceCharge;
    },
    getShippingPrice(state) {
      return state.shippingPrice;
    },
    getTariffPrice(state) {
      return state.tariffPrice;
    },

    checkoutInitiated(state) {
      return state.checkoutInitiated;
    },

    checkoutId(state) {
      return state.checkoutID;
    }
  }
};
