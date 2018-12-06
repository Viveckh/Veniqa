import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Checkout from '@/components/checkout/Checkout.vue';
import MainPage from '@/components/homepage/MainPage.vue';
import Login from '@/views/Login.vue'
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: MainPage
        },
        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        },
        {
          path: 'faqs',
          name: 'faqs',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/FAQs.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/Contact.vue'),
        },
        {
          path: 'vendor/:vendorName',
          props: true,
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/VendorPage.vue'),
        },
        {
          path: 'checkout',
          component: Checkout,
        },
        {
          path: 'products/:productId',
          component: () => import('@/views/ProductDetail.vue'),
          props: true,
        }
      ]
    },
    
    {
      path: '/email-confirmation/:token',
      props: true,
      component: () => import('@/views/EmailConfirmation.vue'),
    },
    {
      path: '/password-reset/:token',
      props: true,
      component: () => import('@/views/PasswordConfirmation.vue'),
    },
    {
      path: '/login',
      component: Login
    }


  ],
});
