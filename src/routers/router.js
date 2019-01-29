import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Checkout from '@/components/checkout/Checkout.vue';
import MainPage from '@/components/homepage/MainPage.vue';
import ProductList from '@/components/product-list/ProductList.vue';
import Login from '@/views/Login.vue';
import SearchResultViewComponent from '@/views/SearchResultViewComponent';
import PageNotFound from '@/views/Notfound.vue';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
<<<<<<< HEAD
      path: '/',
      component: Home,
      children: [{
          path: '',
          component: MainPage,
        },
        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import( /* webpackChunkName: "about" */ '@/views/About.vue'),
        },
        {
          path: 'faqs',
          name: 'faqs',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import( /* webpackChunkName: "about" */ '@/views/FAQs.vue'),
        },
        {
          path: 'contact',
          name: 'contact',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import( /* webpackChunkName: "about" */ '@/views/Contact.vue'),
        },
        {
          path: 'vendor/:vendorName',
          props: true,
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import( /* webpackChunkName: "about" */ '@/views/VendorPage.vue'),
        },
        {
          path: 'checkout',
          component: Checkout,
        },
        {
          path: 'orders',
          component: () => import('@/views/OrderView.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'products/:productId',
          component: () => import('@/views/ProductDetail.vue'),
          props: true,
        },
        {
          path: 'search',
          name: 'search',
          component: SearchResultViewComponent,

          // props: (route) => ({ query: route.query })
        },
      ]
=======
    path: '/',
    component: Home,
    children: [{
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
      path: 'products',
      name: 'products',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ProductList
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
>>>>>>> arjun
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
    if (localStorage.getItem('email') == null || localStorage.getItem('email') === 'null') {
      next({
        path: '/login',
      });
    } else {
      next();
    }
  } else next();
});

export default router;
