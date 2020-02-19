import Pagination from '@/dto/Pagination.json';
import Vue from 'vue';
import ProxyUrls from '@/constants/ProxyUrls';

export default {
  namespaced: true,
  state: {
    paging: _.cloneDeep(Pagination),
    ordersMaster: [],
  },

  mutations: {
    setMasterOrders(state, payload) {
      if (!payload) return;

      state.ordersMaster.splice(0, state.ordersMaster.length);
      state.ordersMaster.push(...payload);
    },

    setPaging(state, allData) {
      if (!allData) return;
      state.paging.page = allData.page;
      state.paging.total = allData.total;
      state.paging.pages = allData.pages;
      state.paging.limit = allData.limit;
    },
  },

  actions: {
    async getOrderList({ state, commit }) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrls.orderList,
          data: {
            pagingOptions: state.paging,
          },
        });

        if (data && data.httpStatus === 200) {
          commit('setMasterOrders', data.responseData.docs);
          commit('setPaging', data.responseData);
        }
      } catch (error) {
        throw error;
      }
      return false;
    },
  },

  getters: {
    orders(state) {
      return state.ordersMaster;
    },
  },
};
