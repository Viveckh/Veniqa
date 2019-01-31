<template>
  <div class="align-left description">
    <h4>{{product.brand}}</h4>
    <h5>{{product.name}}</h5>

    <p>
      <strong>
        <font-awesome-icon icon="dollar-sign"/>
        {{product.price.currency}} {{product.price.amount}}
      </strong>
    </p>
    <p>
      <font-awesome-icon icon="weight"/>
      &nbsp; {{product.weight.quantity}} {{product.weight.unit}}
    </p>

    <div class="custom-attributes">
      <div v-for="(attrib, aid) in customizations" v-bind:key="aid">
        <div v-if="attrib.type === 'Array'">
          <b-form-group
            :label-cols="3"
            :label="attrib.name"
            :label-for="attrib.name+aid"
            horizontal
          >
            <b-form-select
              v-model="selectedCustomizations[attrib.key]"
              :options="attrib.values"
              size="sm"
              :name="attrib.name+aid"
              :id="attrib.name+aid"
              style="max-width: 150px"
            />
            <b-form-invalid-feedback id="countryFeedback">
              <!-- This will only be shown if the preceeding input has an invalid state -->
              The {{attrib.name}} cannot be empty.
            </b-form-invalid-feedback>
          </b-form-group>
        </div>

        <!-- Show Color selection for colors -->
        <div v-if="attrib.type==='Colors'">
          <b-row>
            <b-col md="3">{{attrib.name}}</b-col>
            <b-col md="9">
              <ul class="color-select">
                <li v-for="(color, cid) in attrib.values"
                  v-bind:key="cid">
                  <div
                    v-bind:style="{'background-color': color.hexValue}"
                    v-b-tooltip.hover
                    :title="color.name"
                    @click="colorClicked(attrib.key, color)"
                    v-bind:class="{'selected': color.hexValue === selectedCustomizations[attrib.key].hexValue && color.name === selectedCustomizations[attrib.key].name}"
                  >
                  </div>
                </li>
              </ul>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>

    <p style="margin-top: 20px">
      <b-button size="sm" class="primary-button hvr-grow" @click="addToCart()">
        <font-awesome-icon icon="shopping-bag"/>&nbsp;
        Add to Cart
      </b-button>
    </p>
    <hr>
    <p class="section-title">Product Detail</p>
    <div v-html="product.details_html"></div>
  </div>
</template>

<script>
export default {
  name: 'ProductDescription',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      product: null,
      selectedCustomizations: {}
    };
  },

  created() {
    this.product = this.data;

    // Selected Customization is just used for the simplicity. The values are also changed in this.product.
    this.selectedCustomizations = _.cloneDeep(this.product.customValues);
  },

  methods: {
    async addToCart() {
      this.product.customValues = {};
      Object.keys(this.selectedCustomizations).forEach(key => {
        if (typeof this.selectedCustomizations[key] === 'string') {
          this.product.customValues[key] = this.selectedCustomizations[key];
        } else {
          this.product.customValues[key] = `${this.selectedCustomizations[key].name}|${
            this.selectedCustomizations[key].hexValue
          }`;
        }
      });
      const val = await this.$store.dispatch('cartStore/addToTheCart', [this.product]);
      if (val) {
        this.$notify({
          group: 'toast',
          type: 'success',
          text: `Added ${this.product.name} to the cart`,
          title: 'Added to Cart<font-awesome-icon icon="cart"/>'
        });
      } else {
        this.$notify({
          group: 'toast',
          type: 'warn',
          text: `${this.product.name} couldn't be added for some reason. Please try again later`
        });
      }
    },

    colorClicked(key, colorObj) {
      this.selectedCustomizations[key] = colorObj;
    },

    increaseCount() {
      this.product.counts += 1;
    },

    decreaseCount() {
      this.product.counts -= 1;
      if (this.product.counts < 0) {
        this.product.counts = 0;
      }
    }
  },

  computed: {
    customizations() {
      return this.product.customizationOptions.customizations;
    }
  }
};
</script>

<style lang="scss" scoped>
.description {
  p {
    padding: 5px 0px;
    margin: 0px;

    span {
      margin-right: 10px;
    }

    .icon {
      font-size: 1.5em;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .color-select {
    padding-left: 0px;
    li,
    div {
      display: inline-block;
      height: 30px;
      width: 30px;
      margin-right: 10px;

      &:hover {
        cursor: pointer;
      }

      .selected {
        border: 2px solid black;
      }
    }
  }

  .custom-attributes {
    margin-top: 1rem;
  }
  .section-title {
    font-size: 1.2em;
  }
}
</style>
