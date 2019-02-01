import Vue from 'vue';
import axios from 'axios';
import { eventHub } from '@/utils/EventHub';

const instance = axios.create({
  baseURL: 'https://hsjnruyi2xjmcrl.azurewebsites.net',
  // baseURL: 'http://d7833ea0.ngrok.io',
  withCredentials: true,
});

instance.interceptors.request.use(
  (conf) => {
    eventHub.$emit('before-request');
    return conf;
  },
  (error) => {
    eventHub.$emit('request-error');
    return Promise.reject(error);
  },
);
instance.interceptors.response.use(
  (response) => {
    eventHub.$emit('after-response');
    return response;
  },
  (error) => {
    eventHub.$emit('response-error');
    return Promise.reject(error);
  },
);

Vue.prototype.$axios = instance;
