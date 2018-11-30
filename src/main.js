import Vue from 'vue';
import App from './App.vue';
import router from './routers/router';
import store from './store/store';
import '@/assets/css/colors.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import '@/assets/css/global.scss';


library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
