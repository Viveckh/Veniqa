import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Checkout from '@/components/checkout/Checkout.vue';
import MainPage from '@/components/homepage/MainPage.vue';
import Login from '@/views/Login.vue';
import AdminPage from '@/components/adminpage/adminPage.vue';
import TariffPage from '@/components/tariffpage/tariffpage.vue';
import CategoryPage from '@/components/categorypage/categorypage.vue';
import Featured from '@/views/Featured.vue';
import OrdersMainPage from '@/components/orders/OrdersMainPage.vue';
import OrdersComponent from '@/views/OrderView.vue';
import OrderDetail from '@/components/orders/OrderDetail.vue';
import PageNotFound from '@/views/notfound.vue';
import VueAnalytics from 'vue-analytics';
import Config from '@/app-configs';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/',
          component: MainPage
        },
        {
          path: 'catalog',
          name: 'catalog',
          component: MainPage
        },

        {
          path: 'adminsetting',
          name: 'adminsetting',
          component: AdminPage,
          meta: {
            SUPERADMIN: true
          }
        },

        {
          path: 'tariffsetting',
          name: 'tariffsetting',
          component: TariffPage,
          meta: {
            SUPERADMIN: true,
            TARIFF_VIEW: true,
            TARIFF_MANAGE: true
          }
        },

        {
          path: 'categorysetting',
          name: 'categorysetting',
          component: CategoryPage,
          meta: {
            SUPERADMIN: true,
            CATEGORIES_VIEW: true,
            CATEGORIES_MANAGE: true
          }
        },

        {
          path: '/orders',
          component: OrdersComponent,
          meta: {
            SUPERADMIN: true,
            ORDER_VIEW: true,
            ORDER_MANAGE: true
          },
          children: [
            {
              path: '/',
              component: OrdersMainPage
            },
            {
              path: 'orderdetail',
              name: 'orderdetail',
              component: OrderDetail
            }
          ]
        },

        {
          path: 'featured',
          name: 'featured',
          component: Featured,
          meta: {
            SUPERADMIN: true,
            FEATURED_VIEW: true,
            FEATURED_MANAGE: true,
            FEATURED_PREVIEW: true
          }
        },

        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
        },
        {
          path: 'faqs',
          name: 'faqs',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/FAQs.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'contact',
          name: 'contact',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/Contact.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'vendor/:vendorName',
          props: true,
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '@/views/VendorPage.vue')
        },
        {
          path: 'checkout',
          component: Checkout
        }
      ]
    },

    {
      path: '/email-confirmation/:token',
      props: true,
      component: () => import('@/views/EmailConfirmation.vue')
    },
    {
      path: '/password-reset/:token',
      props: true,
      component: () => import('@/views/PasswordConfirmation.vue')
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // For some reason, local storage can send null as string 'null'
    if (localStorage.getItem('email') == null || localStorage.getItem('email') === 'null') {
      next({
        path: '/login'
      });
    } else {
      const userPermissions = localStorage.getItem('permissions');
      // const userPermissions = perms ? localStorage.getItem('permissions').split(',') : [];

      const moveForward = to.matched.some(rec => {
        const keys = Object.keys(rec.meta);
        if (keys.length === 0) return true;

        if (userPermissions && userPermissions.indexOf('SUPERADMIN') >= 0) return true;

        const matches = keys.filter(key => userPermissions.indexOf(key) >= 0);
        if (matches.length > 0) return true;

        return false;
      });

      if (moveForward) {
        next();
      } else {
        next('catalog');
      }
    }
  } else {
    next();
  }
});

Vue.use(VueAnalytics, {
  id: Config.analyticsId,
  router
});

export default router;
