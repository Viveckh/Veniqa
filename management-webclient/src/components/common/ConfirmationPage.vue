<template>
  <div>
    <b-modal
      id="modal-center"
      no-close-on-backdrop
      no-close-on-esc
      size="md"
      visible
      centered
      :title="title"
      ok-title="Yes"
      cancel-title="No"
      @ok="yesTriggered()"
      @hide="noTriggered()"
      @cancel="noTriggered()"
    >
      <p>{{text}}</p>
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
