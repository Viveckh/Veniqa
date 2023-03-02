<template>
  <div class="align-left shipping">
    <div v-if="allAddresses.length > 0" class="addresses">
      <ul class="shipping-list">
        <li
          v-for="(add, aIndex) in allAddresses"
          v-bind:key="aIndex"
          v-bind:class="{'selected' : addressEqual(add)}"
          @click="chooseAddress(add)"
        >
          <b-row>
            <b-col>
              {{add.firstName}} {{add.lastName}}
              <br>
              {{add.addressLine1}} {{add.addressLine2}}
              <br>
              {{add.state}} {{add.country}} {{add.zipCode}}
            </b-col>
            <b-col>
              <div class="align-right">
                <a @click="editClicked(add)">Edit</a> &nbsp;&nbsp;&nbsp;
                <a @click="deleteClicked(add)">Delete</a>
              </div>
            </b-col>
          </b-row>
        </li>
      </ul>
    </div>
    <div v-else-if="allAddresses.length <= 0 && !isShowAddAddress">
      <div class="empty-info">
        <p>Nothing to display</p>
      </div>
    </div>

    <!-- Show list of existing addresses here with choice to choose -->
    <a @click="showAddAddress()" v-if="isSessionActive">
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
                size="sm"
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
                size="sm"
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
            size="sm"
            name="text"
            :state="address1State"
            v-model="shippingDeet.addressLine1"
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
            size="sm"
            v-model="shippingDeet.addressLine2"
            placeholder="Enter your address 2"
          ></b-form-input>
        </b-form-group>

        <b-row>
          <b-col>
            <b-form-group>
              <label for="city">City:</label>
              <b-form-input
                id="city"
                type="text"
                name="text"
                :state="cityState"
                size="sm"
                v-model="shippingDeet.city"
                placeholder="Enter your city"
                aria-describedby="cityStatee"
              ></b-form-input>
              <b-form-invalid-feedback id="cityStatee">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                Please enter your city before continuing
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group>
              <label for="phone">Phone:</label>
              <b-form-input
                id="phone"
                type="number"
                name="text"
                :state="phoneState"
                size="sm"
                v-model="shippingDeet.mobilePhone"
                placeholder="Enter your phone number"
                aria-describedby="phoneStatee"
              ></b-form-input>
              <b-form-invalid-feedback id="phoneStatee">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                Please enter your city before continuing
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <b-form-group>
              <label for="state">State:</label>
              <b-form-input
                id="state"
                type="text"
                name="state"
                size="sm"
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
                size="sm"
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
              <b-form-select
                v-model="shippingDeet.country"
                :options="countryOptions"
                size="sm"
                :state="countryState"
                name="country"
                id="country"
              />
              <b-form-invalid-feedback id="countryFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                The country cannot be empty.
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="action-buttons">
          <b-button variant="secondary-button" class="cancel-btn" @click="cancelForm()">Cancel</b-button>
          <b-button class="primary-button" v-if="!isUpdate" @click="saveAddress()">Save</b-button>
          <b-button class="primary-button" v-else @click="saveAddress()">Edit</b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ShippingDTO from '@/dto/ShippingAddress.json';
import { mapGetters } from 'vuex';

export default {
  name: 'ShippingDetail',
  async created() {
    this.shippingDeet = ShippingDTO;
    await this.$store.dispatch('shippingStore/addressAction', {
      address: null,
      action: 'get',
    });

    if (this.allAddresses.length > 0 && !this.selectedAddress) {
      this.$emit('selected', this.allAddresses[0]);
    }
  },
  data() {
    return {
      isShowAddAddress: false,
      shippingDeet: null,
      description: '',
      isUpdate: false,
      countryOptions: ['Bangladesh', 'Nepal'],
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
      this.isUpdate = false;
    },

    resetFields() {
      // eslint-disable-next-line
      for (const key in this.shippingDeet) {
        this.shippingDeet[key] = null;
      }
    },

    addressEqual(givenAdd) {
      return _.isEqual(givenAdd, this.selectedAddress);
    },

    chooseAddress(add) {
      this.$emit('selected', add);
    },

    editClicked(address) {
      this.isUpdate = true;
      this.shippingDeet = _.cloneDeep(address);
      this.isShowAddAddress = true;
    },

    deleteClicked(address) {
      const cloned = _.cloneDeep(address);
      this.$store.dispatch('shippingStore/addressAction', {
        address: cloned,
        action: 'delete',
      });
    },

    async saveAddress() {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in this.shippingDeet) {
        if (this.shippingDeet[key] == null) {
          this.shippingDeet[key] = '';
        }
      }
      if (
        this.firstNameState
        && this.address1State
        && this.stateState
        && this.zipState
        && this.countryState
        && this.cityState
      ) {
        const cloned = _.cloneDeep(this.shippingDeet);
        const res = await this.$store.dispatch('shippingStore/addressAction', {
          address: cloned,
          action: this.isUpdate ? 'put' : 'post',
        });

        if (res) {
          this.isUpdate = false;
          // this.allAddresses.push(cloned);
          // this.$emit('selected', cloned);

          this.resetFields();
          this.isShowAddAddress = false;
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      allAddresses: 'shippingStore/allAddresses',
      selectedAddress: 'shippingStore/getSelectedAddress',
      isSessionActive: 'authStore/isSessionActive',
    }),

    cityState() {
      if (this.shippingDeet.city == null) return null;
      return this.shippingDeet.city.length >= 1;
    },

    phoneState() {
      if (this.shippingDeet.mobilePhone == null) return null;
      return this.shippingDeet.mobilePhone.length >= 1;
    },

    firstNameState() {
      if (this.shippingDeet.firstName == null) return null;
      return this.shippingDeet.firstName.length >= 1;
    },

    address1State() {
      if (this.shippingDeet.addressLine1 == null) return null;
      return this.shippingDeet.addressLine1.length > 0;
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
@import '../../assets/css/global.scss';
.shipping-form {
  padding: 10px 0px;
  // background: white;

  .cancel-btn {
    margin-right: 10px;
    margin-top: 2em;
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
