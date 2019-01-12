import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import PageSetup from '@/dto/PageDTO';
import _ from 'lodash';

export default {
  namespaced: true,
  state: {
    orders: [],
    orderStatus: '',

    pagination: {},
  },

  mutations: {
    setOrderStatus(state, val) {
      state.orderStatus = val;
    },

    setOrderDetails(state, payload) {
      if (payload.docs) {
        state.orders = [];
        state.orders.push(...payload.docs);
      }

      state.pagination = {
        total: payload.total,
        limit: payload.limit,
        page: payload.page,
        pages: payload.pages,
      };
    },
  },

  actions: {
    async getOrdersByStatus({ commit }, status) {
      let reqObj = {
        orderStatus: status,
      };

      reqObj = _.assignIn(reqObj, PageSetup);

      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrl.getOrderByStatus,
          method: 'post',
          data: reqObj,
        });

        commit('setOrderDetails', data.responseData);
        commit('setOrderStatus', status);
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  getters: {
    orderStatus(state) {
      return state.orderStatus;
    },

    orders(state) {
      return state.orders;
    },
  },
};
