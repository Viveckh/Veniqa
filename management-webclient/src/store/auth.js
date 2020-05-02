import ProxyUrls from '@/constants/ProxyUrls.js';
import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    email: '',
    name: '',
    isSessionActive: false,
    permissions: [],
  },
  actions: {
    async registerUser({
      state,
      commit,
    }, payload) {
      if (!payload) return null;

      try {
        const res = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.registerUrl,
          data: payload,
        });

        if (res && res.data) {
          commit('setEmail', res.data.email);
          commit('setName', res.data.name);
          commit('setSessionActive', true);
        }

        return res;
      } catch (err) {
        throw new Error(err);
      }
    },

    async login({
      state,
      commit,
    }, payload) {
      if (!payload) return null;

      try {
        const res = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.loginUrl,
          data: payload,
          // withCredentials: true,
        });

        if (res && res.data) {
          commit('setEmail', res.data.email);
          commit('setName', res.data.name);
          commit('setSessionActive', true);
          commit('setPermissions', res.data.permissions);
        }
        return res;
      } catch (err) {
        throw new Error(err);
      }
    },

    async logout({
      state,
      commit,
    }, payload) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'get',
          url: ProxyUrls.logoutUrl,
        });

        if (data) {
          commit('logout');
          return true;
        }
        throw new Error('Could not be fulfilled');
      } catch (error) {
        throw new Error(error);
      }
    },

    async initiateAppSession({
      state,
      commit,
    }) {
      const res = await Vue.prototype.$axios({
        method: 'get',
        url: ProxyUrls.isSessionActive,
        // withCredentials: true,
      });
      if (res && res.data == true) {
        commit('setEmail', localStorage.getItem('email'));
        commit('setName', localStorage.getItem('name'));
        commit('setPermissions', localStorage.getItem('permissions'));
        commit('setSessionActive', true);
      } else {
        commit('setSessionActive', false);
      }
    },
  },
  mutations: {
    setPermissions(state, payload) {
      state.permissions = payload;
      localStorage.setItem('permissions', payload);
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
        localStorage.removeItem('permissions');
      }
    },

    logout(state) {
      state.isSessionActive = false;
      state.permissions = [];
      state.name = '';
      state.email = '';
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('permissions');
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
      return state.name.split(' ')[0];
    },

    isSessionActive(state) {
      return state.isSessionActive;
    },

    permissions(state) {
      return state.permissions;
    },
  },
};
