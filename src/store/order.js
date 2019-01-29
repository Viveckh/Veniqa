import Pagination from "@/dto/Pagination";


export default {
  namespaced: true,
  state: {
    paging: _.cloneDeep(Pagination),
    ordersMaster: []
  },

  mutations: {
  },

  actions: {

  },

  getters: {
    orders(state){return state.ordersMaster;}
  }
}