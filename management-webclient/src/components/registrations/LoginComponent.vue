<template>
  <div>
    <div class="header">
      <h2>
        <strong v-if="!forgotEnabled">Admin Login</strong>
        <strong v-else>Forgot Password</strong>
      </h2>
      <p v-if="forgotEnabled">Please enter your email to reset the password.</p>
    </div>

    <b-form-group>
      <b-form-input
        id="username"
        type="email"
        name="username"
        :state="usernameState"
        v-model="username"
        placeholder="Enter Email"
        aria-describedby="usernameFeedback"
      ></b-form-input>
      <b-form-invalid-feedback id="usernameFeedback">
        <!-- This will only be shown if the preceeding input has an invalid state -->
        Enter a valid email address
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group>
      <b-form-input
        v-if="!forgotEnabled"
        type="password"
        name="password"
        :state="passwordState"
        v-model="password"
        @keyup.native.enter="loginClicked()"
        placeholder="Enter Password"
        aria-describedby="passwordFeedback"
      ></b-form-input>
      <b-form-invalid-feedback id="passwordFeedback">Enter at least 6 characters.</b-form-invalid-feedback>
    </b-form-group>

    <p class="forget-password" v-if="!forgotEnabled" @click="forgetPassword()">Forgot Password?</p>

    <b-btn class="login-button" v-if="!forgotEnabled" @click="loginClicked()">Login</b-btn>
    <b-btn class="login-button" v-if="forgotEnabled" @click="resetPassword()">Reset Password</b-btn>

    <!-- <p class="register-class" @click="register()">New User? Register here.</p> -->
    <div class="modal-bottom"></div>
  </div>
</template>

<script>
import ProxyUrl from '@/constants/ProxyUrls';

export default {
  name: 'LoginComponent',
  data() {
    return {
      username: '',
      password: '',
      forgotEnabled: false,
    };
  },
  methods: {
    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    forgetPassword() {
      // this.$emit('forgotPassword', this.usernameState ? this.username : '');
      this.forgotEnabled = true;
      this.password = '';
    },

    loginClicked() {
      if (this.usernameState && this.passwordState) {
        this.$emit('login', {
          email: this.username,
          password: this.password,
        });
      }
    },

    async resetPassword() {
      if (this.usernameState) {
        try {
          const { data } = await this.$axios({
            method: 'get',
            url: ProxyUrl.forgotPassword + this.username,
          });
          if (data && data.httpStatus === 200) {
            this.$emit('close');

            this.$notify({
              group: 'all',
              type: 'success',
              text:
                'The email was just sent. Please check your email and follow the instructions.',
            });
          }
        } catch (err) {
          this.$notify({
            group: 'all',
            type: 'error',
            text:
              'The email could not be sent right now. Please try again later',
          });
        }
      }
    },

    register() {
      this.$emit('register');
    },
  },
  computed: {
    usernameState() {
      if (this.username.length === 0) return null;
      return this.validEmail(this.username);
    },

    passwordState() {
      if (this.password.length === 0) return null;
      return this.password.length >= 6;
    },
  },
};
</script>

<style lang='scss'>
.forget-password {
  text-align: right;
  cursor: pointer;
}

.header {
  // margin: 50px 0px;
  color: red;

  h2 {
    margin-bottom: 1em;
  }
}
.login-button {
  width: 100%;
  background-image: linear-gradient(to right, red, red) !important;
  border: 0px;
}

.register-class {
  padding-top: 20px;
  cursor: pointer;
}
</style>
