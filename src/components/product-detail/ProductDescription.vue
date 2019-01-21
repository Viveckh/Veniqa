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
          <!-- <b-form-select v-model="selectedCustomizations[attrib.key]" :options="attrib.values" class="mb-3" size="sm" /> -->
        </div>
      </div>
    </div>

    <!-- <p class="section-title">
      <span>Quantity</span>
      <span class="icon"><font-awesome-icon icon='chevron-circle-down' @click="decreaseCount()"/></span>
      <span>{{product.counts}}</span>
      <span class="icon"><font-awesome-icon icon='chevron-circle-up' @click="increaseCount()"/></span>
    </p>-->
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
      required: true,
    },
  },
  data() {
    return {
      product: null,
      selectedCustomizations: [],
    };
  },

  created() {
    this.product = this.data;
    this.product.customizationOptions.customizations.forEach((attrib) => {
      this.selectedCustomizations.push(attrib.key);
      this.selectedCustomizations[attrib.key] = attrib.values.length > 0 ? attrib.values[0] : '';
    });
  },

  methods: {
    async addToCart() {
      const val = await this.$store.dispatch('cartStore/addToTheCart', [
        this.product,
      ]);
      if (val) {
        this.$notify({
          group: 'toast',
          type: 'success',
          text: `Added ${this.product.name} to the cart`,
          title: 'Added to Cart<font-awesome-icon icon="cart"/>',
        });
      } else {
        this.$notify({
          group: 'toast',
          type: 'warn',
          text: `${
            this.product.name
          } couldn't be added for some reason. Please try again later`,
        });
      }
    },

    increaseCount() {
      console.log('Increasing');
      this.product.counts += 1;
    },

    decreaseCount() {
      this.product.counts -= 1;
      if (this.product.counts < 0) {
        this.product.counts = 0;
      }
    },
  },

  computed: {
    customizations() {
      return this.product.customizationOptions.customizations;
    },
  },
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

  .custom-attributes {
    margin-top: 1rem;
  }
  .section-title {
    font-size: 1.2em;
  }
}
</style>
