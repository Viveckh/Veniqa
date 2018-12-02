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

export default {
  name: "UserAccountModal",
  components: {
    LoginComponent,
    RegisterComponent
  },
  data() {
    return {
      showLogin: true
    }
  },

  methods: {
    login({username, password}){
      console.log("Username", username);
      console.log("Password", password)
    },

    register({username, password, phone}){
      console.log("Register with")
      console.log("Username", username);
      console.log("Password", password)
      console.log("Phone", phone)
    },

    navigateToRegister() {
      this.showLogin = false;
    },

    navigateToLogin() {
      this.showLogin = true;
    }
  }
  
};
</script>

<style lang="scss">

</style>
