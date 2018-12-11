import Vue from 'vue';
import axios from 'axios';
import ProxyUrls from '../constants/ProxyUrls';

const instance = axios.create({
  baseURL: 'https://hsjnruyi2xjmcrl.azurewebsites.net',
  withCredentials: true,
});
Vue.prototype.$axios = instance;
