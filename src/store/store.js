import Vue from 'vue';
import Vuex from 'vuex';

// Import modules here.
import CartStore from '@/store/cart';
import AuthStore from '@/store/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cartStore: CartStore,
    authStore: AuthStore,
  },
});
