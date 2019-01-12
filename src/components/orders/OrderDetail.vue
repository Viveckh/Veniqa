<template>
  <div class="general-padding" id="order-detail">
    <h3>Order Details</h3>

    <p class="status">
      Order Status: {{openOrder.overall_status}}
      <b-btn variant="success" size="sm">Confirm</b-btn>
      <b-btn variant="secondary" size="sm" @click="cancel()">Cancel</b-btn>
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'OrderDetail',
  data() {
    return {

    }
  },

  created() {
    if (this.openOrder == null){
      this.$router.push({path: '/orders'})
    }
  },

  methods: {
    cancel() {
      this.$store.commit('orderStore/setOpenOrder', null);
      this.$router.push({ path: '/orders'});
    }
  },

  computed: {
    ...mapGetters({
      openOrder: 'orderStore/openOrder'
    })
  }
}
</script>

<style lang="scss" scoped>
#order-detail{
  .status{
    button {
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  p{
    color: #212529;
  }
}
</style>

