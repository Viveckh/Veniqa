<template>
  <div id="app">
    <header-menu/>
    <router-view/>
    <footer-view/>
  </div>
</template>

<script>
import HeaderMenu from '@/components/HeaderMenu.vue';
import FooterView from '@/components/Footer.vue';

import axios from 'axios';

export default {
  name: 'app',
  components: {
    HeaderMenu,
    FooterView,
  },

  async created() {
    await this.$store.dispatch('authStore/initiateAppSession');

    // axios({
    //   method: 'get',
    //   url: 'https://veniqa.azurewebsites.net/checkout',
    //   withCredentials: true
    // })
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin:0px;
  color: #2c3e50;
  /* height: 100%; */
  font-size: 18px;
}

html,body{
  margin: 0px;
  height: 100%;
}

.container{
  margin: 0px !important;
}
</style>
