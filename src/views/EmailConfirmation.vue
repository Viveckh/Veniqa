<template>
  <div class="confirmation-page">
    <div class="page">
      <div v-if="value" class="req-success">
        <font-awesome-icon icon='check-circle' class="check-button animated bounce infinite slow"/>
        <br>
        Email Confirmed.
      </div>
      <div v-else-if="value == false" class="req-err">
        <font-awesome-icon icon='check-circle' class="check-button animated bounce infinite slow"/>
        <br>
        Email could not be confirmed.
      </div>
    </div>
  </div>
</template>

<script>
import ProxyUrls from '@/constants/ProxyUrls.js';

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

      }
    }
  },

  data() {
    return {
      value: null,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/global.scss";

.confirmation-page{
  height: 700px;
  line-height: 700px;

  .req-success{
    color: $primary-green;
  }

  .req-err{
    color: $primary-red;
  }
  .page{
    display: inline-block;
    line-height: normal;
    vertical-align: middle;
    font-size: 1.5em;
  }

  .check-button{
    font-size: 3em;
    margin: 20px 0px;
  }
}
</style>
