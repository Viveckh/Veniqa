import Vue from 'vue';
import axios from 'axios';
import { eventHub } from '@/utils/EventHub';
import { SilentUrls } from '../constants/Constants';

const baseURL = process.env.VUE_APP_API_BASE_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true
});

instance.interceptors.request.use(
  conf => {
    if (!SilentUrls.includes(conf.url)) {
      eventHub.$emit('before-request');
    }
    return conf;
  },
  error => {
    eventHub.$emit('request-error');
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  response => {
    // console.log(response.request.responseURL)
    // const len = response.request.responseURL.length;
    // const url = response.request.responseURL.substring(baseURL.length - 1, len);
    eventHub.$emit('after-response');
    return response;
  },
  error => {
    eventHub.$emit('response-error');
    return Promise.reject(error);
  }
);
Vue.prototype.$axios = instance;
