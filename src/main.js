/* eslint-disable */
import Vue from "vue";
import "@/assets/css/colors.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import BootstrapVue from "bootstrap-vue";
import store from "./store/store";
import router from "./routers/router";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "@/assets/css/global.scss";
import "@/assets/css/overrides.scss";

import VueScrollTo from "vue-scrollto";
import Notifications from "vue-notification";

// This is not actual VueAxios npm package. It is from @/plugins/axios.js
import VueAxios from "./plugins/axios";
import _ from "lodash";

import "animate.css";

// Vue.use(VueScrollTo)
Vue.use(Notifications);

//Vue Toggle Button
import ToggleButton from "vue-js-toggle-button";
Vue.use(ToggleButton);

// You can also pass in the default options
Vue.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease-in-out",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
