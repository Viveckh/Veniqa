export default {
  namespaced: true,
  state: {
    loading: false,
  },
  mutations: {
    setLoader(state) {
      state.loading = true;
    },

    unsetLoader(state) {
      state.loading = false;
    },
  },

  getters: {
    isLoading(state) {
      return state.loading;
    },
  },
};
