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
    <p v-if="Object.keys(product.custom_attributes).length > 0">
      <strong>Custom attributes and selections are gonna be here.</strong>
    </p>

    <!-- <p class="section-title">
      <span>Quantity</span>
      <span class="icon"><font-awesome-icon icon='chevron-circle-down' @click="decreaseCount()"/></span>
      <span>{{product.counts}}</span>
      <span class="icon"><font-awesome-icon icon='chevron-circle-up' @click="increaseCount()"/></span>
    </p> -->

    <p style="margin-top: 20px">
      <b-button size="sm" class="primary-button hvr-grow" @click="addToCart()">
        <font-awesome-icon  icon="shopping-bag"/>&nbsp;
        Add to Cart
      </b-button>
    </p>
    <hr>
    <p class="section-title">Product Detail
    </p>
    <p>
      Ribbed-knit storm cuffs add warmth to this wind and water-resistant puffer jacket from Tommy Hilfiger, designed with an attached hood lined with cozy micro-fleece for a soft touch.
      <br><br>
      Approx. model height is 6'1" and he is wearing a size medium<br>
      Heavyweight<br>
      Front zip closure<br>
      Stand collar with attached drawstring hood<br>
      Hand pockets at sides; interior pocket<br>
      Tommy Hilfiger logo flag embroidery at chest<br>
      Created for Macy's<br>
      Shell: nylon; lining and filler: polyester<br>
      Machine washable<br>
      Imported<br>
      Savings Based On Offering Prices, Not Actual Sales<br>
      Web ID: 6550128<br>
    </p>
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
    };
  },

  created() {
    this.product = this.data;
  },

  methods: {
    async addToCart() {
      const val = await this.$store.dispatch('cartStore/addToTheCart', [this.product]);
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

};
</script>

<style lang="scss" scoped>
.description {
  p {
    padding: 5px 0px;
    margin: 0px;

    span{
      margin-right: 10px;
    }

    .icon{
      font-size: 1.5em;

      &:hover{
        cursor: pointer;
      }
    }
  }

  .section-title{
    font-size: 1.2em;
  }


}
</style>
