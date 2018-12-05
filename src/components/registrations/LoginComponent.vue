<template>
  <div>
    <div class="header">
      <font-awesome-icon class="user-icon" icon="user-circle"/>
      <h2>
        <strong>Login</strong>
      </h2>
    </div>

    <b-form-group>
      <b-form-input
        id="username"
        type="email"
        name="username"
        :state="usernameState"
        v-model="username"
        placeholder="Enter Username"
        aria-describedby="usernameFeedback"
      ></b-form-input>
      <b-form-invalid-feedback id="usernameFeedback">
        <!-- This will only be shown if the preceeding input has an invalid state -->
        Enter a valid email address
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group>
      <b-form-input
        type="password"
        name="password"
        :state="passwordState"
        v-model="password"
        @keyup.enter="loginClicked()"
        placeholder="Enter Password"
        aria-describedby="passwordFeedback"
      ></b-form-input>
      <b-form-invalid-feedback id="passwordFeedback">Enter at least 6 characters.</b-form-invalid-feedback>
    </b-form-group>

    <p class="forget-password" @click="forgetPassword()">Forgot Password?</p>

    <b-btn class="login-button" @click="loginClicked()">Login</b-btn>

    <p class="register-class" @click="register()">New User? Register here.</p>
    <div class="modal-bottom"></div>


  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    validEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    forgetPassword() {},

    loginClicked() {
      console.log('Going here');
      if (this.usernameState && this.passwordState) {
        this.$emit('login', {
          email: this.username,
          password: this.password,
        });
      }
    },

    register() {
      this.$emit('register');
    },
  },
  computed: {
    usernameState() {
      if (this.username.length == 0) return null;
      return this.validEmail(this.username);
    },

    passwordState() {
      if (this.password.length == 0) return null;
      return this.password.length > 6;
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
  margin: 50px 0px;
  color: #267871;

  .user-icon {
    font-size: 100px;
    margin-bottom: 20px;

  }
  // background: -webkit-linear-gradient( #136a8a, #267871);
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}
.login-button {
  width: 100%;
  background-image: linear-gradient(to right, #136a8a, #267871) !important;
}

.register-class {
  padding-top: 20px;
  cursor: pointer;
}
</style>
