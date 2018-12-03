import Vue from 'vue';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://veniqa.azurewebsites.net/',
  withCredentials: true,
});
Vue.prototype.$axios = instance;
