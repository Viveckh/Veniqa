<template>
  <div>
    <div class="login">
      <div class="content">
        <div class="auth-box">
          <user-account-modal @loginSuccess="loggedIn()"></user-account-modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserAccountModal from '@/components/registrations/UserAccountModal.vue';

export default {
  name: 'Login',
  components: {
    UserAccountModal,
  },

  data() {
    return {
      registrationClass: ['registration-mode'],
      userLoggedIn: false,
    };
  },

  methods: {
    loggedIn() {
      // Do something when logged in.
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";

.login {
  height: 100vh;
  //background-image: $gradient-color;
  line-height: 100vh;

  .content {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    width: 100%;
  }
}

.auth-box {
  width: 70%;
  margin: auto;
  background-color: white;
  //box-shadow: 5px 6px 10px 0px #2e3532;
}
</style>
