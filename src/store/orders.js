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
    openOrder: null,
  },

  mutations: {
    setOpenOrder(state, order) {
      state.openOrder = order;
    },
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
    async cancelOrder({ commit, state }, orderId) {
      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrl.cancelOrder,
          method: 'POST',
          data: {
            orderId,
          },
        });

        if (!data) {
          throw new Error('No Data');
        }
        if (data.httpStatus == 200) {
          commit('setOpenOrder', null);
          return true;
        }

        console.log('HTTP', data.httpStatus == 200);
        return false;
      } catch (error) {
        throw new Error(error);
      }
    },
    async markAsDelivered({ commit, state }, deliveryDetail) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'POST',
          url: ProxyUrl.markDelivered,
          data: deliveryDetail,
        });

        if (data.httpStatus == 200) {
          commit('setOpenOrder', data.responseData);
          return true;
        }

        return false;
      } catch (error) {
        throw new Error(error);
      }
    },

    async markAsShipped({ commit, state }, shippingDetail) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'POST',
          url: ProxyUrl.markShipped,
          data: shippingDetail,
        });

        if (data.httpStatus == 200) {
          commit('setOpenOrder', data.responseData);
          return true;
        }

        return false;
      } catch (error) {
        throw new Error(error);
      }
    },

    async fulfillItem({ commit, state }, fulfillmentDetail) {
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'POST',
          url: ProxyUrl.fulfillOrder,
          data: fulfillmentDetail,
        });

        if (data.httpStatus == 200) {
          commit('setOpenOrder', data.responseData);
          return true;
        }

        return false;
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     *Confirm the open order (state.openOrder)
     *
     * @param {*} {commit}
     */
    async confirmOrder({ commit, state }) {
      if (!state.openOrder || state.openOrder == null) return false;
      const reqObj = {
        orderId: state.openOrder._id,
      };
      try {
        const { data } = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrl.confirmOrder,
          data: reqObj,
        });

        if (data.httpStatus == 200) {
          commit('setOpenOrder', data.responseData);
          return true;
        }

        return false;
      } catch (error) {
        throw new Error(error);
      }
    },

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

    async openOrderDetail({ commit }, order) {
      if (!order || !order._id) return false;
      const orderID = order._id;

      try {
        const { data } = await Vue.prototype.$axios({
          url: ProxyUrl.getSingleOrderById + orderID,
          method: 'get',
        });

        if (data.httpStatus === 200) {
          commit('setOpenOrder', data.responseData);
          return true;
        }

        return false;
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

    openOrder(state) {
      return state.openOrder;
    },
  },
};
