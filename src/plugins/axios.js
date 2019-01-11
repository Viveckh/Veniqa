import Vue from 'vue';
import axios from 'axios';
import ProxyUrls from '../constants/ProxyUrls';

const instance = axios.create({
  baseURL: 'https://hsjnruyi2xjmcrl.azurewebsites.net',
  // baseURL: 'http://d7833ea0.ngrok.io',
  withCredentials: true,
});
Vue.prototype.$axios = instance;
