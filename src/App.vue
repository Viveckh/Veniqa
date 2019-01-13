<template>
  <div id="app">
    <notifications group="all" width="100%" position="bottom center"/>

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

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0px;
  color: #2c3e50;
  /* height: 100%; */
  font-size: 18px;
}

@media (max-width: 768px) {
  #app {
    overflow: hidden;
  }
}

html,
body {
  margin: 0px;
  height: 100%;
  overflow-x: hidden;
}

.container {
  margin: 0px !important;
}

p {
  color: #212529;
}

.notifications {
  .notification-wrapper {
    width: 100vw;
  }

  span {
    display: block;
  }
}
</style>
