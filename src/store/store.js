import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

// Import modules here.
import CartStore from '@/store/cart';
import AuthStore from '@/store/auth';
import AdminStore from '@/store/admin';
import UserStore from '@/store/users';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    // Only persist the cart store in local storage.
    cartStore: state.cartStore,
  }),
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    cartStore: CartStore,
    authStore: AuthStore,
    adminStore: AdminStore,
    userStore: UserStore,
  },

  // This plugin automatically make the data from stores persist by saving it into local storage.
  plugins: [vuexLocal.plugin],
});
