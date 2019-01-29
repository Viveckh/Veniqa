<template>
  <div id="header-menu">
    <!-- <b-navbar
      toggleable="md"
      :type="navType()"
      fixed="top"
      :class="{'header-color': this.scrollPos > 50}"
    >-->
    <b-navbar toggleable="md" fixed="top" class="header-color" type="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/">
        <img
          src="@/assets/logo_transparent_blue_black.png"
          alt="VENIQA"
          width="180px"
          style="padding: 0.5rem 0rem;"
        >
      </b-navbar-brand>

      <b-nav-item class="d-xs-block d-sm-block d-md-none" to="/checkout">
        <font-awesome-icon icon="shopping-cart" style="font-size: 1.2em"/>
        <b-badge :pill="true" variant="danger">{{totalOrders}}</b-badge>
      </b-nav-item>

      <transition
        name="shipping-form-anim"
        enter-active-class="animated slideInLeft slower"
        leave-active-class="animated slideOutLeft slower"
      >
        <b-collapse is-nav id="nav_collapse" class="collapsible-content">
          <b-navbar-nav class="ml-auto">
            <transition
              name="shipping-form-anim"
              enter-active-class="animated fadeInRight faster"
              leave-active-class="animated fadeOutLeft faster"
            >
              <input
                type="text"
                class="special-search-input d-none d-md-block"
                placeholder="Search for products"
                v-if="showSearch"
                v-model="searchTerm"
                @keyup.enter="searchProduct()"
                @keydown.esc="showSearch = false"
              >
            </transition>
            <div
              class="veniqa-nav d-none d-md-block"
              style="padding-top: 8px; font-size: x-large"
              v-if="!showSearch"
            >
              <font-awesome-icon
                @click="showSearch = true"
                style="color: rgba(0, 0, 0, 0.5)"
                class="icon"
                icon="search"
              />
            </div>
            <b-nav-item-dropdown
              class="veniqa-nav no-dropdown-display d-none d-md-block"
              text="Shop"
            >
              <b-dropdown-item to="/vendor/amazon">Jackets</b-dropdown-item>
              <b-dropdown-item to="/vendor/amazon">Tees</b-dropdown-item>
              <b-dropdown-item to="/vendor/amazon">Pants</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item to="products" class="veniqa-nav d-none d-md-block">Test</b-nav-item>
            <b-nav-item
              class="veniqa-nav d-none d-md-block"
              to="/login"
              v-if="!userSessionActive"
            >Login</b-nav-item>

            <b-nav-item-dropdown
              class="veniqa-nav d-none d-md-block"
              :text="nameOfUser"
              right
              v-else
            >
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item v-if="isSessionActive" to="/orders">Orders</b-dropdown-item>
              <b-dropdown-item @click="logoutClicked()">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
            <!-- </b-nav-item> -->
            <b-nav-item class="veniqa-nav d-none d-md-block" to="/checkout">
              <font-awesome-icon icon="shopping-cart" style="font-size: 1.2em"/>
              <b-badge :pill="true" variant="danger">{{totalOrders}}</b-badge>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Displays only when collapsible option is true -->
          <div class="sidenav ml-auto d-md-none">
            <div class="align-right close-icon">
              <font-awesome-icon v-b-toggle.nav_collapse icon="times"/>
            </div>
            <b-nav-item class="align-left collapse-nav" to="/vendor/amazon">Men's</b-nav-item>
            <b-nav-item class="align-left collapse-nav" to="/vendor/amazon">Women's</b-nav-item>
            <b-nav-item class="align-left collapse-nav">Profile</b-nav-item>
            <b-nav-item class="align-left collapse-nav" v-if="isSessionActive" to="/orders">Orders</b-nav-item>
            <b-nav-item
              class="d-none d-md-block collapse-nav"
              to="/login"
              v-if="!userSessionActive"
            >Login</b-nav-item>
            <b-nav-item class="align-left collapse-nav" @click="logoutClicked()" v-else>Logout</b-nav-item>
          </div>
          <!-- End of Collapsible view display -->
        </b-collapse>
      </transition>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
;
export default {
  name: 'HeaderMenu',
  // mounted() {
  //   window.addEventListener('scroll', this.updateScroll);
  // },
  data() {
    return {
      scrollPos: null,
      showSearch: false,
      searchTerm: '',
    };
  },
  methods: {
    searchProduct() {
      this.$store.commit('searchStore/setSearchTerm', this.searchTerm);
      this.$router.push('/search');
    },
    async logoutClicked() {
      try {
        const res = await this.$store.dispatch('authStore/logout');
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'You have been successfully logged out.',
        });
        this.$store.commit('cartStore/resetOrders');
        this.$store.commit('shippingStore/resetAddresses');
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Sorry but we could not log you out at the moment.',
        });
      }
    },
    // updateScroll() {
    //   this.scrollPos = window.scrollY;
    // },
    // navType() {
    //   return this.scrollPos > 50 ? 'dark' : 'light';
    // },
  },
  // destroy() {
  //   window.removeEventListener('scroll', this.updateScroll);
  // },
  computed: {
    nameOfUser() {
      return this.$store.getters['authStore/getFirstName'];
    },
    userSessionActive() {
      return this.$store.getters['authStore/isSessionActive'];
    },
    totalOrders() {
      return this.$store.getters['cartStore/getTotalItems'];
    },
    ...mapGetters({
      isSessionActive: 'authStore/isSessionActive',
    }),
  },
};
</script>

<style lang="scss">
@import '../assets/css/global.scss';
.special-search-input {
  border: none;
  padding: 0px 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  min-width: 20rem;
  &:focus {
    outline: none;
  }
}
.sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 90%; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: white; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 20px;
  .close-icon {
    color: black;
    font-size: xx-large;
    padding: 0px;
    padding-right: 2rem;
    cursor: pointer;
    font-weight: lighter;
  }
}
/* The navigation menu links */
.sidenav li {
  list-style: none;
}
/* When you mouse over the navigation links, change their color */
.sidenav li .active {
  color: #f1f1f1 !important;
  background-color: $pitch-black !important;
}
.header-color {
  background-color: white;
  // color: white !important;
}

.veniqa-nav {
  padding: 5px 10px;
  margin-left: 2rem;
}
.registration-mode {
  .modal-content {
    background-image: $home-button-bg;
    border: 0px;
    padding: 0 2em;
  }
}
.modal-backdrop {
  background-image: linear-gradient(#136a8a, #267871) !important;
}
.modal-backdrop.show {
  opacity: 0.7 !important;
}
.navbar-override {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  .navbar-brand {
    margin-right: 0px;
  }
}
.collapsible-content {
  z-index: 10;
}
.collapse-nav {
  padding: 0.2rem 0rem;
}
// 768 is the changing point.
@media (min-width: 768px) {
  .navbar-brand.abs {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    text-align: center;
    padding: 0;
    margin-right: 0;
  }
}
/* this is when the screen size is small */
@media (max-width: 768px) {
  .navbar-override {
    background-color: $pitch-black;
    width: 100%;
    a {
      color: $white-shade !important;
    }
    .navbar-toggler {
      border-color: $white-shade !important;
    }
  }
}
</style>

