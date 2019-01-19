import Vue from 'vue';
import axios from 'axios';
import {
  eventHub
} from "@/utils/EventHub";
import {
  SilentUrls
} from "./../constants/Constants";

const instance = axios.create({
  baseURL: 'https://veniqa.azurewebsites.net/',
  withCredentials: true,
});

instance.interceptors.request.use(
  conf => {
    let startIndex = conf.baseURL.length;
    let temp = conf.url.substring(startIndex, conf.url.length);
    if (SilentUrls.includes(temp)) {
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
    eventHub.$emit('after-response');
    return response;
  },
  error => {
    eventHub.$emit('response-error');
    return Promise.reject(error);
  }
);
Vue.prototype.$axios = instance;
