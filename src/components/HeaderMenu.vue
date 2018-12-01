<template>
  <div>
    <b-navbar toggleable="md" type="light" fixed="top" class="navbar-override">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand class="abs">
        <img src="@/assets/logo.png" alt="VENIQA" width="120px">
      </b-navbar-brand>
      <b-collapse is-nav id="nav_collapse" class="collapsible-content">
        <b-navbar-nav>
          <b-nav-item class="veniqa-nav" href="#">Deals</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#">Amazon</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#">Macy's</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#">Sephora</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#">Michael Kors</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item class="veniqa-nav" to="/about">About</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/faqs">FAQs</b-nav-item>
          <b-nav-item class="veniqa-nav" to="/contact">Contact</b-nav-item>
          <b-nav-item class="veniqa-nav" href="#">Login</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'HeaderMenu',
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@import "../assets/css/global.scss";

.veniqa-nav {
  padding: 5px 10px;
}

.navbar-override{
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.collapsible-content{
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
  }
}

/* this is when the screen size is small */
@media (max-width: 768px){
  .navbar-override {
    background-color: $pitch-black;
    width: 100%;

    a{
    color: $white-shade !important;
}
    .navbar-toggler {
      border-color: $white-shade !important;
    }
  }
}
</style>
