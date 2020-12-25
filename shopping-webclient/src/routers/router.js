import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Checkout from '@/components/checkout/Checkout.vue';
import MainPage from '@/components/homepage/MainPage.vue';
import Login from '@/views/Login.vue';
import PageNotFound from '@/views/Notfound.vue';
import VueAnalytics from 'vue-analytics';
import Config from '@/app-configs';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
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
          path: 'search',
          component: () => import('@/views/SearchView.vue'),
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
          path: 'checkout',
          component: Checkout,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'orders',
          component: () => import('@/views/OrderView.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'orders/:id',
          component: () => import('@/components/orders/SingleOrderDetail.vue'),
          meta: {
            requiresAuth: true,
          },
          props: true,
        },
        {
          path: 'products/:productId',
          component: () => import('@/views/ProductDetail.vue'),
          props: true,
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

    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound,
    },
  ],
});

// Auth guard that prevents the page from going forward if the user is not authorized for the paths that need authorization.
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('email') == null || localStorage.getItem('email') === 'null') {
      next({
        path: '/login',
        query: {
          previousPath: from.fullPath
        }
      });
    } else {
      next();
    }
  } else if (to.fullPath === '/login') {
    // Setting previous path here so that it can be rerouted to old url that was open before login
    next({
      path: '/login',
      query: {
        previousPath: from.fullPath
      }
    });
  } else {
    next();
  }
});

Vue.use(VueAnalytics, {
  id: Config.analyticsId,
  router
});

export default router;
