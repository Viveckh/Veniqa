<template>
  <div id="app">
    <notifications group="all" width="100%" position="bottom center"/>
    <notifications group="toast" position="top right"/>

    <router-view/>

  </div>
</template>

<script>


import { mapGetters } from 'vuex';

import axios from 'axios';

export default {
  name: 'app',


  async created() {
    await this.$store.dispatch('authStore/initiateAppSession');

    if (this.isSessionActive) {
      this.$store.dispatch('cartStore/getCart');
    }
  },

  computed: {
    ...mapGetters({
      isSessionActive: 'authStore/isSessionActive',
    }),
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

@media (max-width: 768px){
  #app{
    overflow: hidden;
  }
}

html,body{
  margin: 0px;
  height: 100%;
}

.container{
  margin: 0px !important;
}
</style>
