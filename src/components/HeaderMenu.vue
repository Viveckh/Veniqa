<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">Veniqa Admin</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="#" active>Inventory</b-nav-item>
          <b-nav-item href="#">Orders</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search Admin Options"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown text="Settings" right>
            <b-dropdown-item href="#">Roles</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>{{nameOfUser}}</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- <b-navbar toggleable="md" type="dark" variant="danger" sticky="true">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">Veniqa Admin Panel</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" class="collapsible-content">
        <b-navbar-nav class="ml-auto">
          <b-nav-item class="veniqa-nav">Link</b-nav-item>
          <b-nav-item class="veniqa-nav" disabled>Disabled</b-nav-item>

          <b-nav-item class="veniqa-nav" to="/login" v-if="!userSessionActive">Login</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#" v-else>{{"Logged in as " + nameOfUser}}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>-->
  </div>
</template>

<script>
export default {
  name: 'HeaderMenu',

  computed: {
    nameOfUser() {
      return this.$store.getters['authStore/getFirstName'];
    },

    userSessionActive() {
      return this.$store.getters['authStore/isSessionActive'];
    },

    orders() {
      return this.$store.getters['cartStore/getCart'];
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
