<template>
  <div id="app">
    <notifications group="all" width="100%" position="bottom center" />
    <div v-if="isLoading">
      <fingerprint-spinner class="spinner" :animation-duration="1500" :size="150" color="#136a8a" />
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { FingerprintSpinner } from 'epic-spinners';
import { eventHub } from '@/utils/EventHub';

export default {
  name: 'app',
  components: {
    FingerprintSpinner
  },

  data() {
    return {
      refCount: 0,
      isLoading: false
    };
  },

  async created() {
    eventHub.$on('before-request', this.setLoading);
    eventHub.$on('request-error', this.unsetLoading);
    eventHub.$on('after-response', this.unsetLoading);
    eventHub.$on('response-error', this.unsetLoading);

    await this.$store.dispatch('authStore/initiateAppSession');
  },

  beforeDestroy() {
    eventHub.$off('before-request', this.setLoading);
    eventHub.$off('request-error', this.unsetLoading);
    eventHub.$off('after-response', this.unsetLoading);
    eventHub.$off('response-error', this.unsetLoading);
  },

  methods: {
    setLoading() {
      this.refCount += 1;
      this.isLoading = true;
    },

    unsetLoading() {
      if (this.refCount > 0) {
        this.refCount -= 1;
        this.isLoading = this.refCount > 0;
      }
    }
  },

  computed: {
    ...mapGetters({
      isSessionActive: 'authStore/isSessionActive'
    })
  }
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

.spinner {
  position: fixed !important;
  top: 0px !important;
  height: 100vh !important;
  width: 100% !important;
  z-index: 10000 !important;
  background: rgba(255, 255, 255, 0.8) !important;
}
</style>
