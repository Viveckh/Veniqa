<template>
  <div>
    <b-row class="account-all">
      <b-col md="5">
        <div class="account-table">
          <div class="account-body">
            <div class="account-content image">
              <img src="./../../assets/logo.png" alt="Logo" width="250px">
            </div>
          </div>
          <div class="account-body">
            <div class="account-content">

              <div v-if="activePanel =='registration'" class="inside-section">
                <transition
                  name="register-transition"
                  enter-active-class="animated slideInRight faster"
                >
                  <register-component @register="register" @loginNav="navigateToLogin"></register-component>
                </transition>
              </div>
              <div v-if="activePanel=='login'" class="inside-section">
                <transition
                  name="login-transition"
                  enter-active-class="animated slideInRight faster"
                >
                  <login-component
                    @login="login"
                    @register="navigateToRegister"
                    @close="closeModal()"
                  ></login-component>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </b-col>
      <b-col md="7">
        <div class="advertisement-bg"></div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import LoginComponent from '@/components/registrations/LoginComponent.vue';
import RegisterComponent from '@/components/registrations/RegisterComponent.vue';

export default {
  name: 'UserAccountModal',
  components: {
    LoginComponent,
    RegisterComponent,
  },
  data() {
    return {
      showLogin: true,
      activePanel: 'login',
      showFailure: false,
    };
  },

  methods: {
    closeModal() {
      this.$emit('loginSuccess');
    },
    async login(userInfo) {
      try {
        await this.$store.dispatch('authStore/login', userInfo);

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
        await this.$store.dispatch(
          'authStore/registerUser',
          userInfo,
        );

        this.$emit('loginSuccess');
        this.$notify({
          group: 'all',
          type: 'success',
          text:
            'User successfully created. Please check your inbox to confirm email',
        });
      } catch (err) {
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'User could not be created at the moment. Please check if you already have an account.',
        });
      }
    },

    navigateToRegister() {
      this.activePanel = 'registration';
    },

    navigateToLogin() {
      this.activePanel = 'login';
    },
  },
};
</script>

<style lang="scss" scoped>
.inside-section {
  // padding: 40px 40px;
  // padding-right: 10px;
}

.account-table{
  display: table;
  height: 100%;
  width: 100%;

  .account-body{
    display: table-row;
    .account-content{
      display: table-cell;
      vertical-align: middle;
      padding-left: 30px;

    }

    .image{
      height: 100px;
      width: 100%;
    }
  }
}

.account-all{
  height: 650px;
}

.advertisement-bg {
  background-image: url(./../../assets/images/fashion.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}
</style>
