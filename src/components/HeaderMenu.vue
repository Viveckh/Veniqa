<template>
  <div>
    <b-navbar
      toggleable="md"
      :type="navType()"
      fixed="top"
      :class="{'header-color': this.scrollPos > 50}"
    >
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand class="abs">
        <img
          src="@/assets/logo_transparent_blue_black.png"
          alt="VENIQA"
          width="180px"
          style="padding-top: 5px;"
        >
      </b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" class="collapsible-content">
        <b-navbar-nav>
          <b-nav-item class="veniqa-nav" to="/">Dresses</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/vendor/amazon">Shoes</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/vendor/macys">Pants</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/vendor/macys">Jackets</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="veniqa-nav" to="/about">Tees</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/faqs">Intimates</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/contact">Accessories</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/login" v-if="!userSessionActive">Login</b-nav-item>
          <!-- <b-nav-item class="veniqa-nav" v-else> -->
          <!-- {{nameOfUser}} -->
          <b-nav-item-dropdown class="veniqa-nav" :text="nameOfUser" right v-else>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item v-if="isSessionActive" to="/orders">Orders</b-dropdown-item>
            <b-dropdown-item @click="logoutClicked()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
          <!-- </b-nav-item> -->
          <b-nav-item class="veniqa-nav" to="/checkout">
            <font-awesome-icon icon="shopping-cart" style="font-size: 1.2em"/>
            <b-badge :pill="true" variant="danger">{{totalOrders}}</b-badge>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HeaderMenu',
  mounted() {
    window.addEventListener('scroll', this.updateScroll);
  },
  data() {
    return {
      scrollPos: null,
    };
  },
  methods: {
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

    updateScroll() {
      this.scrollPos = window.scrollY;
    },

    navType() {
      return this.scrollPos > 50 ? 'dark' : 'light';
    },
  },
  destroy() {
    window.removeEventListener('scroll', this.updateScroll);
  },
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
@import "../assets/css/global.scss";

.header-color {
  background-color: $pitch-black;
  color: white !important;
}
.veniqa-nav {
  padding: 5px 10px;
  font-size: 1.3em;
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
