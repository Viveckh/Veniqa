<template>
  <div id="order-view" class="align-left">
    <div class="space"></div>
      <h2>Your orders</h2>
      <hr>

       <b-tabs>
      <template slot="tabs">
        <b-nav-item v-for="(item, ind) in tabs" v-bind:key="ind" :active="activeTab === item.key" @click="tabSelected(item.key)">
          {{item.name}}
        </b-nav-item>
      </template>
    </b-tabs>


  </div>
</template>

<script>
export default {
  name: 'OrderView',
  data() {
    return {
      tabs: [
        {
          name: 'Orders',
          key: 'all'
        },
        {
          name: 'Open Orders',
          key: 'open'
        },
        {
          name: 'Cancelled',
          key: 'cancelled'
        }
      ],

      activeTab: 'all'
    };
  },

  created() {
    // Look for all the items from the order list.
    // await this.$store
  },

  methods: {
    tabSelected(key) {
      this.activeTab = key;
    }
  }
};
</script>

<style lang="scss">
#order-view {
  min-height: 90vh;
  width: 80%;
  margin: auto;
}
</style>
