<template>
  <div id="delivered">
    <div>
      <b-modal
        centered
        no-close-on-backdrop
        no-close-on-esc
        title="Delivery Info"
        visible
        ok-title="Fulfill"
        hide-footer
        @hide="cancelClicked()"
      >
        <b-row>
          <b-col md="4">Delivery Date</b-col>
          <b-col md="8">
            <datetime type="datetime" v-model="detail.deliveryDate" class="theme-orange datetime-input"></datetime>
          </b-col>
        </b-row>

        <div class="footer-modal">
          <hr>
          <div class="align-right">
            <b-btn @click="cancelClicked()" size="sm">Cancel</b-btn>
            <b-btn v-if="!editMode" @click="okClicked()" variant="primary" size="sm">Mark as Shipped</b-btn>
            <b-btn v-else @click="editClicked()" variant="primary" size="sm">Edit</b-btn>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeliveredModal',
  props: {
    deliveryDetail: {
      required: false,
      type: Object,
    },

    editMode: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detail: null,
    };
  },

  created() {
    this.detail = {
      deliveryDate: null,
    };

    if (this.deliveryDetail) {
      this.detail.deliveryDate = this.deliveryDetail.delivery_date;
    }
  },

  methods: {
    okClicked() {
      const validate = this.validateForm();
      if (!validate || validate == null) {
        return;
      }
      const dataToSend = _.cloneDeep(this.detail);

      this.$emit('delivered', dataToSend);
    },

    editClicked() {
      const validate = this.validateForm();
      if (!validate || validate == null) {
        return;
      }
      const dataToSend = _.cloneDeep(this.detail);

      this.$emit('delivered', dataToSend, true);
    },

    cancelClicked() {
      this.$emit('cancel');
      this.detail = null;
    },

    validateForm() {
      return this.detail.deliveryDate != null;
    },
  },
};
</script>

<style lang="scss">
#delivered {

  .datetime-input{
    border: 1px solid #dbdbdb;
    border-radius: 0.2rem;
  }
}
</style>
