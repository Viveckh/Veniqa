import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';

export default {
  namespaced: true,
  state: {
    cart: [],
  },
  actions: {
    async addToTheCart({
      commit,
    }, payload) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addToCart,
          method: 'post',
          data: {
            product_id: payload._id,
          },
        });

        commit('setCart', res.data);
      } catch (err) {
        console.log('Error occured', err);
      }
    },

    async getCart({
      commit,
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
      commit,
    }, products) {
      const deletedIds = _.map(products, '_id');
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'post',
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
    }) {
      const orders = _.map(state.cart, c => ({
        product_id: c._id,
        counts: c.counts,
      }));

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'post',
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
