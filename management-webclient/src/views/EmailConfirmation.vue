<template>
  <div class="confirmation-page">
    <div class="page">
      <div v-if="value" class="req-success">
        <font-awesome-icon icon="check-circle" class="check-button animated bounce infinite slow"/>
        <br>Email Confirmed.
      </div>
      <div v-else-if="value == false">
        <font-awesome-icon
          icon="times-circle"
          class="req-err check-button animated bounce infinite slow"
        />
        <br>
        <span class="req-err">Email could not be confirmed.</span>
        <br>
        <br>
        <div>
          <br>
          <b-form-group>
            <b-form-input
              id="email"
              type="email"
              name="email"
              :state="emailState"
              v-model="email"
              placeholder="Resend your email"
              aria-describedby="emailFeedback"
            ></b-form-input>
            <b-form-invalid-feedback id="emailFeedback" style="font-size: 12px; text-align: left">
              <!-- This will only be shown if the preceeding input has an invalid state -->
              Enter a valid email address
            </b-form-invalid-feedback>
          </b-form-group>
          <!-- <font-awesome-icon
                  icon="chevron-circle-right"
                  class="req-success align-left"
                  style="font-size: 1.3em; cursor: pointer"
                  @click="resendEmail()"
          />-->
          <div>
            <a @click="resendEmail()">Resend</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProxyUrls from '@/constants/ProxyUrls';

export default {
  name: 'EmailConfirmation',
  props: {
    token: {
      required: true,
      default: String,
    },
  },

  async created() {
    if (this.token) {
      try {
        const { data } = await this.$axios({
          method: 'get',
          url: `${ProxyUrls.confirmEmail}/${this.token}`,
        });

        if (data) {
          this.value = true;
        } else {
          this.value = false;
        }
      } catch (err) {
        console.log('There was an error');
      }
    }
  },

  data() {
    return {
      value: null,
      resendHit: false,
      email: '',
    };
  },

  methods: {
    validEmail(email) {
      // eslint-disable-next-line
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    async resendEmail() {
      if (this.emailState) {
        try {
          await this.$axios({
            method: 'get',
            url: ProxyUrls.resendEmail + this.email,
          });

          this.$notify({
            group: 'all',
            type: 'success',
            text: 'Email successfully sent. Please check your inbox.',
          });
        } catch (err) {
          this.$notify({
            group: 'all',
            type: 'error',
            text:
              'Some error occured while trying to send the email. Please try later.',
          });
        }
      }
    },
  },

  computed: {
    emailState() {
      if (this.email.length === 0) return null;
      return this.validEmail(this.email);
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/global.scss";

</style>
