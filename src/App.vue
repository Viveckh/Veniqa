<template>
  <div id="app">
    <notifications
      group="all"
      classes="vue-notification main-notification"
      width="100%"
      position="bottom center"
    />
    <notifications
      group="toast"
      class="toast-noti"
      classes="vue-notification toast-notification"
      position="top right"
    />
    <div v-if="isLoading">
    <fingerprint-spinner class="spinner" :animation-duration="1500" :size="150" color="#136a8a"/>

    </div>

    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { FingerprintSpinner } from 'epic-spinners';
import axios from 'axios';

export default {
  name: 'app',
  components: {
    FingerprintSpinner,
  },

  async created() {
    await this.$store.dispatch('authStore/initiateAppSession');

    if (this.isSessionActive) {
      this.$store.dispatch('cartStore/getCart');
    }
  },

  computed: {
    ...mapGetters({
      isSessionActive: 'authStore/isSessionActive',
      isLoading: 'loaderStore/isLoading',
    }),
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0px;
  color: #2c3e50;
  /* height: 100%; */
  font-size: 0.93em;
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
}

.container {
  margin: 0px !important;
}

.toast-notification {
  /* margin-top: 100px !important; */
  font-size: 0.8em !important;
  padding: 20px 10px !important;
}

.toast-noti {
  top: 100px !important;
}

.spinner {
  position: fixed !important;
  top: 0px !important;
  height: 100vh !important;
  width: 100% !important;
  z-index: 10000 !important;
  background: rgba(255, 255, 255, 0.8) !important;
}
</style>
