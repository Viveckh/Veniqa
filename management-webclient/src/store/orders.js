import Vue from 'vue';
import ProxyUrl from '@/constants/ProxyUrls';
import Pagination from '@/dto/Pagination.json';
import _ from 'lodash';

export default {
  namespaced: true,
  state: {
    orders: [],
    orderStatus: '',

    pagination: _.cloneDeep(Pagination),
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

    setComments(state, payload) {
      if (state.openOrder) {
        state.openOrder.comments = payload;
      }
    },
  },

  actions: {
    async commentRequest({
      commit,
    }, reqData) {
      try {
        reqData.url = ProxyUrl[`${reqData.method}Comment`];
        const {
          data,
        } = await Vue.prototype.$axios(reqData);

        if (!data) throw new Error("Data doesn't exist");

        if (data.httpStatus === 200) {
          commit('setComments', data.responseData);
          return true;
        }
        return false;
      } catch (error) {
        throw new Error(error);
      }
    },
    async cancelOrder({
      commit,
    }, orderId) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrl.cancelOrder,
          method: 'POST',
          data: {
            orderId,
          },
        });

        if (!data) {
          throw new Error('No Data');
        }
        if (data.httpStatus === 200) {
          commit('setOpenOrder', null);
          return true;
        }

        console.log('HTTP', data.httpStatus === 200);
        return false;
      } catch (error) {
        throw new Error(error);
      }
    },
    async markAsDelivered({
      commit,
    }, {
      deliveryDetail,
      editMode,
    }) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: editMode ? 'PUT' : 'POST',
          url: editMode ? ProxyUrl.editDelivered : ProxyUrl.markDelivered,
          data: deliveryDetail,
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

    async markAsShipped({
      commit,
    }, {
      shippingDetails,
      editMode,
    }) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: editMode ? 'PUT' : 'POST',
          url: editMode ? ProxyUrl.editShipped : ProxyUrl.markShipped,
          data: shippingDetails,
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

    async fulfillItem({
      commit,
    }, payload) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: payload.editMode ? 'PUT' : 'POST',
          url: payload.editMode ? ProxyUrl.editFulfillOrder : ProxyUrl.fulfillOrder,
          data: payload.fulfillmentDetail,
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
    /**
     *Confirm the open order (state.openOrder)
     *
     * @param {*} {commit}
     */
    async confirmOrder({
      commit,
      state,
    }) {
      if (!state.openOrder || state.openOrder == null) return false;
      const reqObj = {
        orderId: state.openOrder._id,
      };
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          method: 'post',
          url: ProxyUrl.confirmOrder,
          data: reqObj,
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

    async getOrdersByStatus({
      commit,
      state
    }, status) {
      const reqObj = {
        orderStatus: status,
        pagingOptions: state.pagination,
        sortRule: '-auditLog.createdOn'
      };

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
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

    async openOrderDetail({
      commit,
    }, order) {
      if (!order || !order._id) return false;
      const orderID = order._id;

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
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

    pagination(state) {
      return state.pagination;
    }
  },
};
