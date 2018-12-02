import axios from 'axios';
import ProxyUrls from '@/constants/ProxyUrls.js';

export default {
  namespaced: true,
  state: {
    email: '',
    name: '',
  },
  actions: {
    async registerUser({state, commit},payload) {
      if (!payload) return null;
  
      const res = await axios({
        method: 'post',
        url: ProxyUrls.baseUrl + ProxyUrls.registerUrl,
        data: payload,
      });

      if(res && res.data){
        commit('setEmail', res.data.email);
        commit('setName', res.data.name);
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('name', res.data.name);
      }
      
      return res;
    },
  
    async login({state, commit},payload){
      if(!payload) return null;
  
      const res = await axios({
        method: 'post',
        url: ProxyUrls.baseUrl + ProxyUrls.loginUrl,
        data: payload,
      });

      if(res && res.data){
        commit('setEmail', res.data.email);
        commit('setName', res.data.name);
        localStorage.setItem('email', payload.email);
      }

      console.log(res)
  
      return res;
    }
  },
  mutations: {
    setEmail(state, email){
      state.email = email;
    },

    setName(state, name){
      state.name = name;
    }
  },
  getters: {
    getName(state){
      return state.name;
    },

    getEmail(state){
      return state.email;
    },

    getFirstName(state){
      return state.name.split(" ")[0];
    }
  },
};
