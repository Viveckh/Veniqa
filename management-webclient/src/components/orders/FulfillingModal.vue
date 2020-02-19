<template>
  <div id="fulfilling">
    <div>
      <b-modal
        centered
        no-close-on-backdrop
        no-close-on-esc
        title="Fulfill Order"
        visible
        ok-title="Fulfill"
        hide-footer
        @hide="cancelClicked()"
      >
        <b-form-group horizontal :label-cols="4" label="Store" label-for="store">
          <b-form-select
            v-model="detail.store"
            :options="stores"
            size="sm"
            id="store"
            name="store"
            :state="storeState"
            aria-describedby="storeFeedback"
          />

          <b-form-invalid-feedback id="storeFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Store cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group horizontal :label-cols="4" label label-for="custom-store">
          <b-form-input
            v-if="detail.store == 'CUSTOM'"
            id="custom-store"
            type="text"
            name="custom-store"
            :state="customStoreState"
            v-model="detail.customStore"
            placeholder="Enter the store's name."
            aria-describedby="customStoreFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="customStoreFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group horizontal :label-cols="4" label="Order ID" label-for="order-num">
          <b-form-input
            id="order-num"
            type="text"
            name="order-num"
            :state="orderNumState"
            v-model="detail.orderNumber"
            placeholder="Enter the order id."
            aria-describedby="orderNumFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="orderNumFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group horizontal :label-cols="4" label="Total Cost" label-for="cost">
          <b-form-input
            id="cost"
            type="number"
            step="0.01"
            name="cost"
            :state="costState"
            v-model="detail.totalCostPriceOfItemUSD"
            placeholder="Enter the price of the product"
            aria-describedby="priceFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="priceFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty or negative.
          </b-form-invalid-feedback>
        </b-form-group>

        <div class="footer-modal">
          <hr>
          <div class="align-right">
            <b-btn @click="cancelClicked()" size="sm">Cancel</b-btn>
            <b-btn v-if="!editMode" @click="okClicked()" variant="primary" size="sm">Fulfill</b-btn>
            <b-btn v-else @click="editClicked()" variant="primary" size="sm">Edit</b-btn>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import FulfillingItemOrder from '@/dto/FulfillingItemOrder.json';

export default {
  name: 'FulfillingModal',
  props: {
    fulfillItem: {
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
      stores: ['AMAZON', 'MACYS', 'SEPHORA', 'CUSTOM'],
    };
  },

  created() {
    this.detail = _.cloneDeep(FulfillingItemOrder);

    if (this.fulfillItem) {
      this.detail.orderNumber = this.fulfillItem.order_number;
      this.detail.totalCostPriceOfItemUSD = this.fulfillItem.total_cost_price_of_item.amount;
      this.detail.store = this.fulfillItem.store;

      if (this.stores.indexOf(this.detail.store) < 0) {
        this.detail.customStore = this.detail.store;
        this.detail.store = 'CUSTOM';
      }
    }
  },

  methods: {
    okClicked() {
      const validate = this.validateForm();
      if (!validate || validate == null) {
        return;
      }
      const dataToSend = _.cloneDeep(this.detail);

      if (dataToSend.store === 'CUSTOM') dataToSend.store = dataToSend.customStore;
      this.$emit('fulfill', dataToSend);
    },

    editClicked() {
      const validate = this.validateForm();
      if (!validate || validate == null) {
        return;
      }
      const dataToSend = _.cloneDeep(this.detail);

      if (dataToSend.store === 'CUSTOM') dataToSend.store = dataToSend.customStore;
      this.$emit('fulfill', dataToSend, true);
    },

    validateForm() {
      if (this.detail == null) return false;
      let validate = this.storeState && this.orderNumState && this.costState;
      if (this.storeState == null) this.detail.store = '';
      if (this.orderNumState == null) this.detail.orderNumber = '';
      if (this.costState == null) this.detail.totalCostPriceOfItemUSD = 0;
      if (this.detail.store === 'CUSTOM') {
        validate = validate && this.customStoreState;
        if (this.detail.customStore == null) this.detail.customStore = '';
      }
      return validate;
    },

    cancelClicked() {
      this.$emit('cancel');
      this.detail = null;
    },
  },

  computed: {
    storeState() {
      if (this.detail == null || this.detail.store == null) return null;
      return this.detail.store.length > 0;
    },

    orderNumState() {
      if (this.detail == null || this.detail.orderNumber == null) return null;
      return this.detail.orderNumber.length > 0;
    },

    customStoreState() {
      if (this.detail == null || this.detail.customStore == null) return null;
      return this.detail.customStore.length > 0;
    },

    costState() {
      if (this.detail == null || this.detail.totalCostPriceOfItemUSD == null) return null;
      return this.detail.totalCostPriceOfItemUSD > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
#fulfilling {
  .footer {
  }
}
</style>
