<template>
  <div class="animsition">
    <div class="page-wrapper">
      <!-- MENU SIDEBAR-->
      <aside class="menu-sidebar2">
        <div class="logo">
          <a href="#">
            <img src="./../assets/logo.png" alt="Cool Admin" />
          </a>
        </div>
        <div class="menu-sidebar2__content js-scrollbar1">
          <div class="account2">
            <div class="image img-cir img-120">
              <img
                src="https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Alien-512.png"
                alt="Admin"
              />
            </div>
            <h4 class="name">{{ adminname }}</h4>
            <a @click="signout()" class="signout">Sign out</a>
          </div>
          <nav class="navbar-sidebar2">
            <ul class="list-unstyled navbar__list">
              <li class="nav-item">
                <a class="nav-link" @click="navigate('catalog')">
                  <i class="fas fa-list"></i>
                  Catalogs
                </a>
              </li>

              <li class="nav-item" @click="navigate('orders')" v-if="orderPermissionGranted">
                <a class="nav-link">
                  <i class="fas fa-archive"></i>
                  Orders
                </a>
              </li>
              <li class="nav-item" @click="navigate('featured')" v-if="featuredPermissionGranted">
                <a class="nav-link">
                  <font-awesome-icon icon="star" />Featured Posts
                </a>
              </li>
              <li class="nav-item" @click="navigate('adminsetting')" v-if="isSuperAdmin">
                <a class="nav-link">
                  <i class="fas fa-users"></i>
                  Users Setting
                </a>
              </li>
              <li class="nav-item" @click="navigate('tariffsetting')" v-if="tariffViewGranted">
                <a class="nav-link">
                  <i class="fa fa-plane"></i>
                  Tariffs Setting
                </a>
              </li>
              <li
                class="nav-item"
                @click="navigate('categorysetting')"
                v-if="categoriesViewGranted"
              >
                <a class="nav-link">
                  <i class="fa fa-th"></i>
                  Categories Setting
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <!-- END MENU SIDEBAR-->
      <!-- PAGE CONTAINER-->
      <div class="page-container2">
        <!-- STATISTIC-->
        <section class="statistic">
          <div class="section__content section__content--p30">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-6 col-lg-12">
                  <div class="statistic__item">
                    <router-view />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- END PAGE CONTAINER-->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Permission from '@/constants/permissions';
import { mapGetters } from 'vuex';

export default {
  name: 'sidebar',
  components: {},
  methods: {
    navigate(path) {
      this.$router.push({ path: `/${path}` });
    },

    async signout() {
      try {
        const isSuccess = await this.$store.dispatch('authStore/logout');
        if (isSuccess) {
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'Logout successful'
          });

          this.$router.push('/login');
        }
      } catch (error) {
        console.error(error);
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Logout was unsuccessful. Please try again later.'
        });
      }
    }
  },

  computed: {
    ...mapGetters({
      permissions: 'authStore/permissions',
      featuredPermissionGranted: 'authStore/featuredPermissionGranted',
      tariffViewGranted: 'authStore/tariffViewGranted',
      categoriesViewGranted: 'authStore/categoriesViewGranted'
    }),

    adminname() {
      return this.$store.getters['authStore/getName'];
    },

    isSuperAdmin() {
      return this.permissions && this.permissions.indexOf(Permission.SUPERADMIN) >= 0;
    },

    orderPermissionGranted() {
      if (this.isSuperAdmin) return true;
      return (
        this.permissions
        && (this.permissions.indexOf(Permission.ORDER_VIEW) >= 0
        || this.permissions.indexOf(Permission.ORDER_MANAGE) >= 0)
      );
    }
  }
};
</script>

<style>
/*
    DEMO STYLE
*/

/* @import './../assets/css/dashboard.css'; */
@import url('https://fonts.googleapis.com/css?family=Cairo');
body {
  font-family: 'Cairo', sans-serif !important;
}
</style>
