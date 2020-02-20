import ProxyUrls from '@/constants/ProxyUrls';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    email: '',
    name: '',
    isSessionActive: false,
    emailConfirmed: false,
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async registerUser({ state }, payload) {
      if (!payload) return null;

      try {
        const { data } = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.registerUrl,
          data: payload,
        });

        if (data && data.httpStatus === 200) {
          // commit('setEmail', data.responseData.email);
          // commit('setName', data.responseData.name);
          // commit('setSessionActive', true);
          return true;
        }
        return false;
      } catch (err) {
        throw new Error(err);
      }
    },

    async login({ commit }, payload) {
      if (!payload) return null;

      try {
        const { data } = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.loginUrl,
          data: payload,
        });

        if (data) {
          commit('setEmail', data.email);
          commit('setName', data.name);
          commit('setSessionActive', true);
          commit('setEmailConfirmed', data.emailConfirmed === 'true' || data.emailConfirmed === true);
        }
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },

    async logout({ commit }) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'get',
          url: ProxyUrls.logoutUrl,
        });

        if (data) {
          commit('logoutUser');
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async initiateAppSession({ commit }) {
      const res = await Vue.prototype.$axios({
        method: 'get',
        url: ProxyUrls.isSessionActive,
      });
      if (res && res.data === true) {
        commit('setEmail', localStorage.getItem('email'));
        commit('setName', localStorage.getItem('name'));
        commit('setSessionActive', true);
        commit(
          'setEmailConfirmed',
          localStorage.getItem('emailConfirmed') === 'true'
            || localStorage.getItem('emailConfirmed') === true,
        );
      } else {
        commit('setSessionActive', false);
      }
    },
  },
  mutations: {
    setEmailConfirmed(state, val) {
      state.emailConfirmed = val;
      localStorage.setItem('emailConfirmed', val);
    },
    setEmail(state, email) {
      state.email = email;
      localStorage.setItem('email', email);
    },

    setName(state, name) {
      state.name = name;
      localStorage.setItem('name', name);
    },

    setSessionActive(state, val) {
      state.isSessionActive = val;
      if (!val) {
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('emailConfirmed');
        localStorage.removeItem('sessionDT');
      }
    },

    logoutUser(state) {
      state.name = '';
      state.email = '';
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('emailConfirmed');
      state.isSessionActive = false;
    },
  },
  getters: {
    getName(state) {
      return state.name;
    },

    getEmail(state) {
      return state.email;
    },

    getFirstName(state) {
      if (!state.name) return '';
      return state.name.split(' ')[0];
    },

    isSessionActive(state) {
      return state.isSessionActive;
    },

    emailConfirmed(state) {
      return state.emailConfirmed;
    },
  },
};
