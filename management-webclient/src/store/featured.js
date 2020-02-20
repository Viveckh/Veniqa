import Vue from 'vue';
import ProxyUrls from '@/constants/ProxyUrls';
import _ from 'lodash';

export default {
  namespaced: true,
  state: {
    masterFeaturedList: [],
    sections: [],
  },

  mutations: {
    setMasterList(state, payload) {
      // Master list contains the list of all the sections instead of individual section.
      state.masterFeaturedList = [];
      state.masterFeaturedList.push(...payload);
    },

    setSections(state, payload) {
      const uniqueNames = _.uniqBy(payload, 'name');
      state.sections = _.map(uniqueNames, 'name');
    },
  },

  actions: {
    async getAllFeaturedList({ commit }) {
      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrls.getAllFeatures,
          method: 'get',
        });

        if (data && data.httpStatus === 200) {
          commit('setMasterList', data.responseData);
          commit('setSections', data.responseData);
        } else throw new Error('Error code');
      } catch (err) {
        console.log('Error here', err);
        throw err;
      }
    },

    // eslint-disable-next-line no-unused-vars
    async save({ commit }, reqObj) {
      const request = {
        name: reqObj.section,
        content: [],
      };

      reqObj.featuredDesigns.forEach((design) => {
        request.content.push({
          products: _.map(design.products, '_id'),
          config: design.config,
        });
      });

      try {
        const {
          data,
        } = await Vue.prototype.$axios({
          url: ProxyUrls.featuredUrl,
          method: 'post',
          data: request,
        });
        if (data && data.httpStatus === 200) {
          return true;
        } throw new Error('Failed');
      } catch (error) {
        throw error;
      }
    },
  },

  getters: {
    sections(state) {
      return state.sections;
    },

    getDesignsByName(state) {
      return (name) => {
        const val = _.find(state.masterFeaturedList, n => n.name === name);
        return val ? val.content : [];
      };
    },
  },
};
