import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

// Import modules here.
import CartStore from '@/store/cart';
import AuthStore from '@/store/auth';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    cartStore: state.cartStore,
  }),
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cartStore: CartStore,
    authStore: AuthStore,
  },

  plugins: [vuexLocal.plugin],
});
