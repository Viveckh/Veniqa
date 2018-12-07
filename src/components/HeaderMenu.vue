<template>
  <div>
    <b-navbar toggleable="md" type="light" fixed="top" class="navbar-override">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand class="abs">
        <img
          src="@/assets/transparent-logo.png"
          alt="VENIQA"
          width="120px"
          style="padding-top: 20px;"
        >
      </b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" class="collapsible-content">
        <b-navbar-nav>
          <b-nav-item class="veniqa-nav" to="/">Deals</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/vendor/amazon">Amazon</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/vendor/macys">Macy's</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/vendor/sephora">Sephora</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#">Michael Kors</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="veniqa-nav" to="/about">About</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/faqs">FAQs</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/contact">Contact</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/login" v-if="!userSessionActive">Login</b-nav-item>
          <!-- <b-nav-item class="veniqa-nav" v-else> -->
            <!-- {{nameOfUser}} -->
            <b-nav-item-dropdown class="veniqa-nav" :text="nameOfUser" right v-else>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
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
export default {
  name: 'HeaderMenu',
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
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Sorry but we could not log you out at the moment.',
        });
      }
    },
  },
  computed: {
    nameOfUser() {
      return this.$store.getters['authStore/getFirstName'];
    },

    userSessionActive() {
      return this.$store.getters['authStore/isSessionActive'];
    },

    totalOrders() {
      return this.$store.getters['cartStore/getTotal'];
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/global.scss";

.veniqa-nav {
  padding: 5px 10px;
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
