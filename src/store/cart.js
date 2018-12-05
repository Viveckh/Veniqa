import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';


export default {
  namespaced: true,
  state: {
    cart: [],
  },
  actions: {
    async addToTheCart({ state, commit }, payload) {
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addToCart,
          method: 'post',
          data: payload,
        });
      } catch (err) {

      }
      commit('addToCart', payload);
    },
  },
  mutations: {
    addToCart(state, product) {
      const index = _.findIndex(state.cart, { name: product.name });
      if (index >= 0) {
        state.cart[index].quantity += 1;
      } else {
        product.quantity = 1;
        state.cart.push(product);
      }
    },

    deleteOrders(state, products){
      let indexes = [];
      if (products && products.length > 0){
        state.cart.forEach((c, ci) => {
          // Check for the products that do not exist in the given list. This reverse logic is later used to pull all the
          // unselected ones so that Vue can react after the changes.
          if(_.findIndex(products, c) < 0) indexes.push(ci)
        });

        let result = _.pullAt(state.cart, indexes);
        state.cart.splice(0, state.cart.length);
        state.cart.push(...result);

      }
    }
  },
  getters: {
    getCart(state) {
      return state.cart;
    },
  },
};
