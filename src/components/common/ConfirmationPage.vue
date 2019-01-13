<template>
  <div>
    <b-modal id="modal-center" size="sm" visible centered :title="title" ok-title="Yes" cancel-title="No" @ok="yesTriggered()" @cancel="noTriggered()">
      <p class="my-4">{{text}} </p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationPage',
  props: {
    title: {
      required: false,
      type: String,
      default: 'Are you sure?',
    },

    text: {
      required: false,
      type: String,
      default: 'Please choose Yes/No',
    },
  },

  methods: {
    yesTriggered() {
      this.$emit('yes');
    },

    noTriggered() {
      this.$emit('no');
    },
  },
};
</script>

<style>
</style>
