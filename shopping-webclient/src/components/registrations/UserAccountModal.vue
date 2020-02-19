<template>
  <div>
    <b-row class="account-all">
      <b-col md="5" class="account-cols">
        <div class="account-table">
          <div class="account-body">
            <div class="account-content image">
              <img
                @click="$router.push('/')"
                src="./../../assets/transparent-logo.png"
                alt="Logo"
                width="200px"
              >
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
      <b-col md="7" :class="'d-none d-md-table-cell'" class="account-cols">
        <div class="advertisement-bg"></div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import LoginComponent from '@/components/registrations/LoginComponent.vue';
import RegisterComponent from '@/components/registrations/RegisterComponent.vue';
import moment from 'moment';

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
        this.$store.commit('loaderStore/setLoader');
        const data = await this.$store.dispatch('authStore/login', userInfo);
        if (data.cart && data.cart.items.length > 0) {
          const incomingProductIds = _.map(data.cart, 'product_id');
          // Update the cart values.
          const currentCartItems = this.$store.getters['cartStore/getCart'];

          const toAdd = [];
          currentCartItems.forEach((item) => {
            if (incomingProductIds.indexOf(item.product_id) < 0) {
              // Adding the product ID and the counts.
              toAdd.push({
                _id: item.product_id,
                counts: item.counts,
              });
            }
          });
          if (toAdd.length > 0) {
            this.$store.dispatch('cartStore/addToTheCart', toAdd);
          } else {
            this.$store.dispatch('cartStore/getCart');
          }
        }
        this.$emit('loginSuccess');
        localStorage.setItem('sessionDT', moment().format());

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
      this.$store.commit('loaderStore/unsetLoader');
    },

    async register(userInfo) {
      try {
        await this.$store.dispatch(
          'authStore/registerUser',
          userInfo,
        );

        // this.$emit('loginSuccess');
        this.$store.commit('loaderStore/unsetLoader');
        this.navigateToLogin();
        this.$notify({
          group: 'all',
          type: 'success',
          text:
            'User successfully created. Please check your inbox to confirm email',
        });
      } catch (err) {
        console.log('Error', err);
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
.account-table {
  display: table;
  height: 100%;
  width: 100%;

  .account-body {
    display: table-row;
    .account-content {
      display: table-cell;
      vertical-align: middle;
      padding-left: 3rem;
      padding-right: 1.5rem;
    }

    .image {
      height: 100px;
      width: 100%;
    }
  }
}

.account-all {
  height: 100vh;

  .account-cols {
    padding-left: 0;
    padding-right: 0;
  }
}

.advertisement-bg {
  background-image: url(./../../assets/images/fashion.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}
</style>
