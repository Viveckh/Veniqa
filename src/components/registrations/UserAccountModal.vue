<template>
  <div>
    <div v-if="showLogin">
      <login-component @login="login" @register="navigateToRegister"/>
    </div>
    <div v-else>
      <register-component @register="register" @loginNav="navigateToLogin"></register-component>
    </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/registrations/LoginComponent';
import RegisterComponent from '@/components/registrations/RegisterComponent';
import ProxyUrls from '@/constants/ProxyUrls.js';

import axios from 'axios';

export default {
  name: 'UserAccountModal',
  components: {
    LoginComponent,
    RegisterComponent,
  },
  data() {
    return {
      showLogin: true,
      showFailure: false,
    };
  },

  methods: {
    async login(userInfo) {
      try {
        const res = await this.$store.dispatch('authStore/login', userInfo);

        this.$emit('loginSuccess');

        this.$notify({
          group: 'all',
          type: 'success',
          text: 'Successfully logged in',
        });
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'User credentials are not correct. Please try again',
        });
      }
    },

    async register(userInfo) {
      try {
        const res = await this.$store.dispatch(
          'authStore/registerUser',
          userInfo,
        );

        this.$emit('loginSuccess');
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'User successfully created. Please check your inbox to confirm email',
        });
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'User could not be created at the moment. Please check if you already have an account.',
        });
      }
    },

    navigateToRegister() {
      this.showLogin = false;
    },

    navigateToLogin() {
      this.showLogin = true;
    },
  },
};
</script>

<style lang="scss">
</style>
