<template>
  <div>
    
    <div v-if="activeModal =='registration'">
      <transition name="register-transition" enter-active-class="animated zoomIn faster">
        <register-component @register="register" @loginNav="navigateToLogin"></register-component>
      </transition>
    </div>
    <div v-if="activeModal=='login'">
      <transition name="login-transition" enter-active-class="animated zoomIn faster">
        <login-component @login="login"  @register="navigateToRegister" @close="closeModal()"></login-component>
      </transition>
    </div>
  </div>
</template>

<script>
import LoginComponent from "@/components/registrations/LoginComponent";
import RegisterComponent from "@/components/registrations/RegisterComponent";
import ProxyUrls from "@/constants/ProxyUrls.js";
import ForgotPassword from '@/components/registrations/ForgotPasswordComponent';

import axios from "axios";

export default {
  name: "UserAccountModal",
  components: {
    LoginComponent,
    RegisterComponent,
    ForgotPassword
  },
  data() {
    return {
      showLogin: true,
      activeModal: 'login',
      showFailure: false,
    };
  },

  methods: {
    closeModal() {
      this.$emit('loginSuccess')
    },
    async login(userInfo) {
      try {
        const res = await this.$store.dispatch("authStore/login", userInfo);

        this.$emit("loginSuccess");

        this.$notify({
          group: "all",
          type: "success",
          text: "Successfully logged in"
        });
      } catch (err) {
        this.$notify({
          group: "all",
          type: "error",
          text: "User credentials are not correct. Please try again"
        });
      }
    },

    async register(userInfo) {
      try {
        const res = await this.$store.dispatch(
          "authStore/registerUser",
          userInfo
        );

        this.$emit("loginSuccess");
        this.$notify({
          group: "all",
          type: "success",
          text:
            "User successfully created. Please check your inbox to confirm email"
        });
      } catch (err) {
        this.$notify({
          group: "all",
          type: "error",
          text:
            "User could not be created at the moment. Please check if you already have an account."
        });
      }
    },

    navigateToRegister() {
      this.activeModal = 'registration';
    },

    navigateToLogin() {
      this.activeModal = 'login';
    }
  }
};
</script>

<style lang="scss">
</style>
