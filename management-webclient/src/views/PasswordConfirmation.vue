<template>
  <div class="confirmation-page">
    <div class="page">
      <div>
        <div v-if="isReset">
          <h2>Enter a new password</h2>
          <b-form-group>
            <b-form-input
              id="password"
              type="password"
              name="password"
              :state="passwordState"
              v-model="password"
              placeholder="Enter a password"
              aria-describedby="passwordFeedback"
            ></b-form-input>
            <b-form-invalid-feedback id="passwordFeedback">Enter at least 7 characters.</b-form-invalid-feedback>
          </b-form-group>

          <b-form-group>
            <b-form-input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              :state="confirmPasswordState"
              v-model="confirmPassword"
              placeholder="Re-enter the password"
              aria-describedby="confirmPasswordFeedback"
            ></b-form-input>
            <b-form-invalid-feedback
              id="confirmPasswordFeedback"
            >It should match the password entered.</b-form-invalid-feedback>
          </b-form-group>

          <b-button @click="resetPassword()" class="primary-button">Reset Password</b-button>
        </div>
        <div v-else>
          <h2>Re-enter your email for reset link</h2>
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
          <b-button @click="resetButtonClick()" class="primary-button">Resend Email</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProxyUrl from '@/constants/ProxyUrls';

export default {
  name: 'PasswordConfirmation',
  props: {
    token: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isReset: false,
      password: '',
      confirmPassword: '',
      username: '',
    };
  },

  async created() {
    // When created, first confirm if the link is still valid.
    try {
      const { data } = await this.$axios({
        method: 'get',
        url: ProxyUrl.validateResetToken + this.token,
      });

      if (data && data.httpStatus === 200) {
        this.isReset = true;
        this.$notify({
          group: 'all',
          type: 'success',
          text: 'You can now change your password.',
        });
      } else {
        this.$notify({
          group: 'all',
          type: 'warn',
          text:
            'Looks like you are a little too late. Please try resending the email.',
        });
      }
    } catch (err) {
      // console.log("Error ", err);
      this.$notify({
        group: 'all',
        type: 'error',
        text:
          'There was an error fulfilling your request. Please try resending the reset information.',
      });
    }
  },

  methods: {
    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    async resetButtonClick() {
      if (this.usernameState) {
        try {
          const { data } = await this.$axios({
            method: 'get',
            url: ProxyUrl.forgotPassword + this.username,
          });

          if (data && data.httpStatus === 200) {
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
    async resetPassword() {
      if (this.passwordState && this.confirmPasswordState) {
        try {
          const { data } = await this.$axios({
            method: 'post',
            url: ProxyUrl.resetPassword,
            data: {
              token: this.token,
              newPassword: this.password,
            },
          });
          if (data && data.httpStatus === 200) {
            this.$notify({
              group: 'all',
              type: 'success',
              text: 'You can now go ahead and login.',
            });
            this.$router.push('/');
          } else {
            this.isReset = false;
            this.password = '';
            this.confirmPassword = '';

            this.$notify({
              group: 'all',
              type: 'warn',
              text:
                'Looks like you are a little too late. Please try resending the email.',
            });
          }
        } catch (err) {
          this.$notify({
            group: 'all',
            type: 'error',
            text:
              'There was an error fulfilling your request. Please try resending the reset information.',
          });
        }
      }
    },
  },

  computed: {
    passwordState() {
      if (this.password.length === 0) return null;
      return this.password.length > 6;
    },

    confirmPasswordState() {
      if (this.confirmPassword.length === 0) return null;
      return this.confirmPassword === this.password;
    },

    usernameState() {
      if (this.username.length === 0) return null;
      return this.validEmail(this.username);
    },
  },
};
</script>

<style lang="scss" scoped>
#passwordFeedback,
#confirmPasswordFeedback,
#usernameFeedback {
  font-size: 12px;
  text-align: left;
}

h2 {
  margin-bottom: 50px;
}
</style>
