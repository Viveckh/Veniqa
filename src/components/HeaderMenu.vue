<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark justify-content-between">
    <!-- Brand -->
    <a class="navbar-brand" href="#">Veniqa Admin Console</a>

    <ul class="navbar-nav">
      <li class="nav-item">
        <form class="form-inline">
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button class="btn btn-success" type="submit">Search</button>
        </form>
      </li>
      <li class="nav-item">
        <a class="nav-link" >
          <i class="fas fa-lock"></i>
          Logout
        </a>
      </li>
    </ul>
  </nav>
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
