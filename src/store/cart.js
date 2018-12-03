import Vue from 'vue'
import ProxyUrl from '@/constants/ProxyUrls'

export default {
  namespaced: true,
  state: {
    cart: []
  },
  actions: {
    async addToTheCart({state, commit}, payload){
      try {
        const res = await Vue.prototype.$axios({
          url: ProxyUrl.addToCart,
          method: 'post',
          data: payload,
        });
      }catch(err){

      }
      commit('addToCart', payload)
    }
  },
  mutations: {
    addToCart(state, product){
      let index = _.findIndex(state.cart, {name: product.name});
      if(index >=0){
        state.cart[index].quantity +=1;
      }
      else {
        product.quantity = 1;
        state.cart.push(product);
      }
    }
  },
  getters: {},
};
