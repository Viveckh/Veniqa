import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';

export default {
  namespaced: true,
  state: {
    roles: [],
    admins: [],
  },

  actions: {
    async getRoles({
      commit,
    }) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrl.roles,
          withCredentials: true,
          method: 'get',
          data: {},
        });

        if (data && data.httpStatus === 200) {
          commit('setRoles', data.responseData);
        } else throw new Error('No Content');
      } catch (err) {
        console.log(err);
      }
    },
    async getAdmins({
      commit,
    }) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrl.allAdmins,
          withCredentials: true,
          method: 'get',
          data: {},
        });

        if (data && data.httpStatus === 200) {
          commit('setAdmins', data.responseData);
        } else throw new Error('No Content');
      } catch (err) {
        throw new Error(err);
      }
    },
    async addAdmin({
      dispatch,
    }, admin) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrl.addAdmin,
          withCredentials: true,
          method: 'post',
          data: admin,
        });

        if (data && data.httpStatus === 200) {
          dispatch('getAdmins');
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async editAdmin({
      dispatch,
    }, admin) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrl.editAdmin,
          withCredentials: true,
          method: 'put',
          data: admin,
        });

        if (data && data.httpStatus === 200) {
          dispatch('getAdmins');
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    async deleteAdmin({
      dispatch,
    }, dEmail) {
      try {
        await Vue.prototype.$axios({
          url: ProxyUrl.deleteAdmin,
          withCredentials: true,
          method: 'delete',
          data: {
            email: dEmail,
          },
        });
        dispatch('getAdmins');
      } catch (err) {
        console.log(err);
      }
    },
  },
  mutations: {
    setRoles(state, payload) {
      state.roles = payload;
    },
    setAdmins(state, payload) {
      state.admins = payload;
    },
  },
  getters: {
    getroles(state) {
      return state.roles;
    },
    getadmins(state) {
      return state.admins;
    },
  },
};

// (_.find(refDataPayload.product_categories, {name: 'category'})).sub_categories
