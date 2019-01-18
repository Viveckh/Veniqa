import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Checkout from '@/components/checkout/Checkout.vue';
import MainPage from '@/components/homepage/MainPage.vue';
import Login from '@/views/Login.vue';
import AdminPage from '@/components/adminpage/adminPage.vue';
import TariffPage from '@/components/tariffpage/tariffpage.vue';
import Featured from '@/views/Featured';
import OrdersMainPage from '@/components/orders/OrdersMainPage';
import OrdersComponent from '@/views/OrderView';
import OrderDetail from '@/components/orders/OrderDetail';
import PageNotFound from '@/views/notfound.vue';
import _ from 'lodash';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
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
          path: '/',
          component: MainPage,
        },
        {
          path: 'catalog',
          name: 'catalog',
          component: MainPage,
        },

        {
          path: 'adminsetting',
          name: 'adminsetting',
          component: AdminPage,
          meta: {
            SUPERADMIN: true,
          }
        },

        {
          path: 'tariffsetting',
          name: 'tariffetting',
          component: TariffPage,
          meta: {
            SUPERADMIN: true,
          }
        },

        {
          path: '/orders',
          component: OrdersComponent,
          meta: {
            // Doing a basic route level permission.
            ORDER_VIEW: true,
            ORDER_MANAGE: true,
          },
          children: [
            {
              path: '/',
              component: OrdersMainPage,
            },
            {
              path: 'orderdetail',
              name: 'orderdetail',
              component: OrderDetail,
            },
          ],
        },

        {
          path: 'featured',
          name: 'featured',
          component: Featured,
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
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound,
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
      let userPermissions = localStorage.getItem('permissions');
      
      let moveForward = to.matched.some(rec => {
        let keys = Object.keys(rec.meta);
        
        if(keys.length == 0) return true;
        if(userPermissions && userPermissions.indexOf('SUPERADMIN') >=0) return true;
        if(_.intersection(keys, userPermissions) > 0){
          return true;
        }
        else {
          return false;
        }
      })

      if(moveForward){
        next();
      }
      else{
        next('catalog');
      }
    }
  } else {
    next();
  }
});

export default router;
