import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Checkout from '@/components/checkout/Checkout.vue';
import MainPage from '@/components/homepage/MainPage.vue';
import Login from '@/views/Login.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          component: MainPage,
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
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'contact',
          name: 'contact',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/Contact.vue'),
          meta: {
            requiresAuth: true,
          },
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
      ],
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
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // For some reason, local storage can send null as string 'null'
    if (localStorage.getItem('email') == null || localStorage.getItem('email') === 'null') {
      next({
        path: '/login',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
