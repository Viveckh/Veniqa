<template>
  <div class="general-padding" id="order-view">
    <h3>Orders</h3>

    <b-tabs>
      <b-tab title="Received" active @click="tabClicked('received')">
        <br>I'm the first fading tab
      </b-tab>
      <b-tab title="In Progress" @click="tabClicked('in-progress')">
        <br>I'm the second tab content
      </b-tab>
      <b-tab title="Completed" @click="tabClicked('completed')">
        <br>Disabled tab!
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
export default {
  name: 'OrdersView',

  data() {
    return {
      currentTab: 'received',
    };
  },

  methods: {
    tabClicked(tab) {
      this.currentTab = tab;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
