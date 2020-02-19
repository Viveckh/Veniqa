<template>
  <div class="align-left shipping">
    <h3>Shipping Details</h3>
    <hr>

    <div v-if="allAddresses.length > 0" class="addresses">
      <ul class="shipping-list">
        <li
          v-for="(add, aIndex) in allAddresses"
          v-bind:key="aIndex"
          v-bind:class="{'selected' : addressEqual(add)}"
          @click="chooseAddress(add)"
        >
          {{add.firstName}} {{add.lastName}}
          <br>
          {{add.address1}} {{add.address2}}
          <br>
          {{add.state}} {{add.country}} {{add.zipCode}}
        </li>
      </ul>
    </div>

    <!-- Show list of existing addresses here with choice to choose -->
    <a @click="showAddAddress()">
      <font-awesome-icon icon="plus"/>&nbsp;&nbsp; Add a new address
    </a>

    <!-- Input form to add new address for the user -->
    <transition
      name="shipping-form-anim"
      enter-active-class="animated slideInLeft faster"
      leave-active-class="animated slideOutLeft faster"
    >
      <div v-if="isShowAddAddress" class="shipping-form">
        <hr>
        <b-row>
          <b-col md="6">
            <b-form-group>
              <label for="firstName">First Name:</label>
              <b-form-input
                id="firstName"
                type="text"
                name="firstName"
                :state="firstNameState"
                v-model="shippingDeet.firstName"
                placeholder="Enter your first name"
                aria-describedby="firstNameFeedback"
              ></b-form-input>
              <b-form-invalid-feedback id>
                <!-- This will only be shown if the preceeding input has an invalid state -->
                First name cannot be empty
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group>
              <label for="lastName">Last Name:</label>
              <b-form-input
                id="lastName"
                type="text"
                name="lastName"
                v-model="shippingDeet.lastName"
                placeholder="Enter your last name"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group>
          <label for="address1">Address 1:</label>
          <b-form-input
            id="address1"
            type="text"
            name="text"
            :state="address1State"
            v-model="shippingDeet.address1"
            placeholder="Enter your address"
            aria-describedby="address1State"
          ></b-form-input>
          <b-form-invalid-feedback id="address1State">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Please enter your address before continuing
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group>
          <label for="address2">Address 2:</label>
          <b-form-input
            id="address2"
            type="text"
            name="address2"
            v-model="shippingDeet.address2"
            placeholder="Enter your address 2"
          ></b-form-input>
        </b-form-group>

        <b-row>
          <b-col>
            <b-form-group>
              <label for="state">State:</label>
              <b-form-input
                id="state"
                type="text"
                name="state"
                :state="stateState"
                v-model="shippingDeet.state"
                placeholder="Your State"
                aria-describedby="stateFeedback"
              ></b-form-input>
              <b-form-invalid-feedback id="stateFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                Please enter your state.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
              <label for="zip">Zip Code:</label>
              <b-form-input
                id="zip"
                type="number"
                name="zip"
                :state="zipState"
                v-model="shippingDeet.zipCode"
                placeholder="Enter your Zip Code."
                aria-describedby="zipFeedback"
              ></b-form-input>
              <b-form-invalid-feedback id="zipFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                Your Zip Code cannot be empty.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
              <label for="country">Country</label>
              <b-form-input
                id="country"
                type="text"
                name="country"
                :state="countryState"
                v-model="shippingDeet.country"
                placeholder="Enter your country name"
                aria-describedby="countryFeedback"
              ></b-form-input>
              <b-form-invalid-feedback id="countryFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                The country cannot be empty.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="action-buttons">
          <b-button variant="secondary" class="cancel-btn" @click="cancelForm()">Cancel</b-button>
          <b-button class="primary-button" @click="saveAddress()">Save</b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ShippingDTO from '@/dto/ShippingAddress.json';

export default {
  name: 'ShippingDetail',
  props: {
    allAddresses: {
      required: true,
      type: Array,
    },

    selected: {
      required: true,
      type: Object,
    },
  },
  created() {
    this.shippingDeet = ShippingDTO;
  },
  data() {
    return {
      isShowAddAddress: false,
      shippingDeet: null,
    };
  },

  methods: {
    showAddAddress() {
      this.isShowAddAddress = true;
    },
    hideAddAddress() {
      this.isShowAddAddress = false;
    },

    cancelForm() {
      this.resetFields();
      this.isShowAddAddress = false;
    },

    resetFields() {
      Object.keys(this.shippingDeet).forEach(key => {
        this.shippingDeet[key] = null;
      });
    },

    addressEqual(givenAdd) {
      return _.isEqual(givenAdd, this.selected);
    },

    chooseAddress(add) {
      this.$emit('selected', add);
    },

    saveAddress() {
      Object.keys(this.shippingDeet).forEach(key => {
        if (this.shippingDeet[key] == null) {
          this.shippingDeet[key] = '';
        }
      });

      if (
        this.firstNameState
        && this.address1State
        && this.stateState
        && this.zipState
        && this.countryState
      ) {
        const cloned = _.cloneDeep(this.shippingDeet);
        this.allAddresses.push(cloned);
        this.$emit('selected', cloned);

        this.resetFields();
        this.isShowAddAddress = false;
      }
    },
  },

  computed: {
    firstNameState() {
      if (this.shippingDeet.firstName == null) return null;
      return this.shippingDeet.firstName.length >= 1;
    },

    address1State() {
      if (this.shippingDeet.address1 == null) return null;
      return this.shippingDeet.address1.length > 0;
    },

    stateState() {
      if (this.shippingDeet.state == null) return null;
      return this.shippingDeet.state.length > 0;
    },

    zipState() {
      if (this.shippingDeet.zipCode == null) return null;
      return this.shippingDeet.zipCode.length > 0;
    },

    countryState() {
      if (this.shippingDeet.country == null) return null;
      return this.shippingDeet.country.length > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/global.scss";
.shipping-form {
  padding: 10px 0px;
  background: white;

  .cancel-btn {
    margin-right: 10px;
  }

  .action-buttons {
    padding: 10px 0px;
  }
}

.shipping {
  margin-top: 30px;
}

.shipping-list {
  list-style-type: none;
  padding: 0px;
  margin-bottom: 20px;
  li {
    padding: 10px;
    padding-left: 1.2em;
    margin-bottom: 10px;

    &.selected {
      // background: $gradient-color;
      background: $pitch-black;
      color: white;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
