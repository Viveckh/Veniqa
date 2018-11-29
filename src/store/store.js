import Vue from 'vue';
import Vuex from 'vuex';

// Import modules here.
import CartStore from '@/store/cart';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cartStore: CartStore,
  },
});
