import ProxyUrls from '@/constants/ProxyUrls';
import Vue from 'vue';
import _ from 'lodash';
import PermissionConsts from '../constants/permissions';

export default {
  namespaced: true,
  state: {
    email: '',
    name: '',
    isSessionActive: false,
    permissions: []
  },
  actions: {
    async registerUser({ commit }, payload) {
      if (!payload) return null;

      try {
        const res = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.registerUrl,
          data: payload
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

    async login({ commit }, payload) {
      if (!payload) return null;

      try {
        const res = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.loginUrl,
          data: payload
          // withCredentials: true,
        });

        if (res && res.data) {
          commit('setEmail', res.data.email);
          commit('setName', res.data.name);
          commit('setSessionActive', true);
          commit('setPermissions', res.data.permissions);
          localStorage.setItem('permissions', res.data.permissions);
        }
        return res;
      } catch (err) {
        throw new Error(err);
      }
    },

    async logout({ commit }) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'get',
          url: ProxyUrls.logoutUrl
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

    async initiateAppSession({ commit }) {
      const res = await Vue.prototype.$axios({
        method: 'get',
        url: ProxyUrls.isSessionActive
      });
      if (res && res.data === true) {
        commit('setEmail', localStorage.getItem('email'));
        commit('setName', localStorage.getItem('name'));
        commit('setPermissions', localStorage.getItem('permissions').split(','));
        commit('setSessionActive', true);
      } else {
        commit('setSessionActive', false);
      }
    }
  },
  mutations: {
    setPermissions(state, payload) {
      state.permissions = payload;
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
    }
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

    featuredPermissionGranted(state) {
      const requiredPerms = [
        PermissionConsts.FEATURED_MANAGE,
        PermissionConsts.FEATURED_PREVIEW,
        PermissionConsts.FEATURED_VIEW,
        PermissionConsts.SUPERADMIN
      ];
      return _.intersection(state.permissions, requiredPerms).length > 0;
    },

    tariffViewGranted(state) {
      // eslint-disable-next-line max-len
      const requiredPerms = [PermissionConsts.TARIFF_VIEW, PermissionConsts.TARIFF_MANAGE, PermissionConsts.SUPERADMIN];
      return _.intersection(state.permissions, requiredPerms).length > 0;
    },

    categoriesViewGranted(state) {
      const requiredPerms = [
        PermissionConsts.CATEGORIES_VIEW,
        PermissionConsts.CATEGORIES_MANAGE,
        PermissionConsts.SUPERADMIN
      ];
      return _.intersection(state.permissions, requiredPerms).length > 0;
    }
  }
};
