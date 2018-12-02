<template>
  <div>
    <div v-if="showLogin">
      <login-component @login="login" @register="navigateToRegister"/>
    </div>
    <div v-else>
      <register-component @register="register" @loginNav="navigateToLogin"></register-component>
    </div>
    <div class="modal-bottom"></div>

  </div>
</template>

<script>
import LoginComponent from '@/components/registrations/LoginComponent';
import RegisterComponent from '@/components/registrations/RegisterComponent';

import axios from 'axios'

export default {
  name: 'UserAccountModal',
  components: {
    LoginComponent,
    RegisterComponent,
  },
  data() {
    return {
      showLogin: true,
    };
  },

  methods: {
    async login(userInfo) {
      const res = await this.$store.dispatch('authStore/login', userInfo);

      if (res.status && res.status == 200) {
        this.$emit('loginSuccess');

        axios({
          method: 'get',
          url: 'https://veniqa.azurewebsites.net/checkout',
          withCredentials: true
        })
      } else {

      }
    },

    async register(userInfo) {
      const res = await this.$store.dispatch('authStore/registerUser', userInfo);

      if (res.status == 200) {
        this.$emit('loginSuccess');
      } else {

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
