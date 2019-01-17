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


.notifications {
  .notification-wrapper {
    width: 100vw;
  }

  span {
    display: block;
  }
}
</style>
