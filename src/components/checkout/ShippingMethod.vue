<template>
  <div id="shipping-detail" class="align-left">
    <h3>Shipping Method</h3>
    <hr>
    <div v-if="isSessionActive">
      <b-form-group>
        <label for="method">Method</label>
        <b-form-select v-model="shippingMethod" size="sm" name="method" id="method">
          <option :value="null" disabled>Please select an option</option>
          <option v-for="(ship,sid) in shippingMethods" v-bind:key="sid" :value="ship">{{ship.name}}</option>
        </b-form-select>
      </b-form-group>
      <p class="info">Please select the shipping method to get final prices</p>
    </div>
    <div v-else>
      <div class="empty-info">
        <p>Nothing to display</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ShippingMethod",
  data() {
    return {
      shippingMethods: [
        {
          _id: "20 day shipping",
          name: "20 day shipping"
        },
        {
          _id: "Expedited Shipping",
          name: "Expedited shipping"
        },
        {
          _id: 'No Rush Shipping',
          name: 'No Rush Shipping'
        }
      ]
    };
  },
  computed: {
    shippingMethod: {
      get() {
        return this.$store.getters["shippingStore/shippingMethod"];
      },

      set(val) {
        this.$store.commit("shippingStore/setShippingMethod", val);
      }
    },

    ...mapGetters({
      isSessionActive: "authStore/isSessionActive"
    })
  }
};
</script>

<style lang="scss">
#shipping-detail {
  margin-top: 1rem;
}
</style>

