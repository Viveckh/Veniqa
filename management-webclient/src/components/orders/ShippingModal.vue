<template>
  <div id="shipping">
    <div>
      <b-modal centered no-close-on-backdrop no-close-on-esc
        title="Shipping Details" visible ok-title="Fulfill" hide-footer @hide="cancelClicked()">

        <b-form-group horizontal :label-cols="4" label="Provider" label-for="provider">
          <b-form-select
            v-model="detail.provider"
            :options="shippingProviders"
            size="sm"
            id="provider"
            name="provider"
            :state="providerState"
            aria-describedby="providerFeedback"
          />

          <b-form-invalid-feedback id="providerFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Providers cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Tracking Number -->
        <b-form-group horizontal :label-cols="4" label="Tracking ID" label-for="tracking">
          <b-form-input
            id="tracking"
            type="text"
            name="tracking"
            :state="trackingState"
            v-model="detail.trackingNumber"
            placeholder="Enter the tracking id."
            aria-describedby="trackingFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="trackingFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group horizontal :label-cols="4" label="Service" label-for="service">
          <b-form-input
            id="service"
            type="text"
            name="service"
            :state="serviceState"
            v-model="detail.service"
            placeholder="Enter the shipping service."
            aria-describedby="serviceFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="serviceFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group horizontal :label-cols="4" label="Paid Postage" label-for="postage">
          <b-form-input
            id="postage"
            type="number"
            step="0.01"
            name="postage"
            :state="postageState"
            v-model="detail.paidPostageInUSD"
            placeholder="Enter the postage paid"
            aria-describedby="postageFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="postageFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty or negative.
          </b-form-invalid-feedback>
        </b-form-group>

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
import ShippingDetailDTO from '@/dto/ShippingDetailDTO.json';

export default {
  name: 'ShippingModal',
  props: {
    shippingDetail: {
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
      shippingProviders: [
        'MYUS',
        'UPS',
        'USPS',
        'DHL',
        'FEDEX',
        'AMAZON',
      ],
    };
  },

  created() {
    this.detail = _.cloneDeep(ShippingDetailDTO);

    if (this.shippingDetail) {
      this.detail.trackingNumber = this.shippingDetail.tracking_number;
      this.detail.paidPostageInUSD = this.shippingDetail.paid_postage.amount;
      this.detail.service = this.shippingDetail.service;
      this.detail.provider = this.shippingDetail.provider;
    }
  },

  methods: {
    okClicked() {
      const validate = this.validateForm();
      if (!validate || validate == null) {
        return;
      }
      const dataToSend = _.cloneDeep(this.detail);

      // if (dataToSend.store === 'CUSTOM') dataToSend.store = dataToSend.customStore;
      this.$emit('ship', dataToSend);
    },

    editClicked() {
      const validate = this.validateForm();
      if (!validate || validate == null) {
        return;
      }
      const dataToSend = _.cloneDeep(this.detail);

      // if (dataToSend.store === 'CUSTOM') dataToSend.store = dataToSend.customStore;
      this.$emit('ship', dataToSend, true);
    },

    cancelClicked() {
      this.$emit('cancel');
      this.detail = null;
    },

    validateForm() {
      if (this.detail == null) return false;
      const validate = this.providerState && this.trackingState && this.serviceState && this.postageState;
      if (this.detail.provider == null) this.detail.provider = '';
      if (this.detail.trackingNumber == null) this.detail.trackingNumber = '';
      if (this.detail.service == null) this.detail.service = '';
      if (this.detail.paidPostageInUSD == null) this.detail.paidPostageInUSD = 0;

      return validate;
    },
  },

  computed: {
    providerState() {
      if (this.detail.provider == null) return null;
      return this.detail.provider.length > 0;
    },

    trackingState() {
      if (this.detail.trackingNumber == null) return null;
      return this.detail.trackingNumber.length > 0;
    },

    serviceState() {
      if (this.detail.service == null) return null;
      return this.detail.service.length > 0;
    },

    postageState() {
      if (this.detail.paidPostageInUSD == null) return null;
      return this.detail.paidPostageInUSD.length > 0;
    },
  },
};
</script>

<style>

</style>
