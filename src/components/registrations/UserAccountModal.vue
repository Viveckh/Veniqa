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
import AuthService from '@/services/auth.js';

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
