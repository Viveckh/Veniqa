<template>
  <div class="order-detail align-left">
    <h3>Your Order</h3>
    <hr>
    <ul class="orders">
      <li v-for="(item, itemIndex) in orders" v-bind:key="itemIndex">
        <b-row>
          <b-col md="3">
            <div
              class="order-img order-desc"
              v-if="item.product.thumbnailUrls && item.product.thumbnailUrls.length > 0"
              @click="gotoProduct(item.product)"
              :style="orderPicture(item.product.thumbnailUrls[0])"
            ></div>
          </b-col>
          <b-col md="5">
            <div class="order-desc" @click="gotoProduct(item.product._id)">
              {{item.product.name}}
              <br>
              <span style="font-size: 12px">Standard Shipping</span>
            </div>
            <span class="delete" @click="deleteSelected(item)">Delete</span>
          </b-col>
          <b-col class="align-right">
            <b-form-select
              v-model="item.counts"
              :options="countOptions"
              @input="updateCartItem(item)"
              class="mb-3"
            />
          </b-col>
          <b-col
            class="align-right"
          >{{item ? item.aggregatedPrice.currency : ''}} {{item ? item.aggregatedPrice.amount : ''}}</b-col>
        </b-row>
      </li>
    </ul>

    <div class="total-line" v-if="cartTotal && cartTotal.amount > 0">
      <b-row>
        <!-- <hr> -->
        <b-col cols="8">
          <strong>Sub Total</strong>
        </b-col>
        <b-col class="align-right">{{subtotal.currency}} {{subtotal.amount}}</b-col>
      </b-row>

      <b-row>
        <!-- <hr> -->
        <b-col cols="8">
          <strong>Service Charge</strong>
        </b-col>
        <b-col class="align-right">{{serviceCharge.currency}} {{serviceCharge.amount}}</b-col>
      </b-row>

      <b-row>
        <!-- <hr> -->
        <b-col cols="8">
          <strong>Shipping Charge</strong>
        </b-col>
        <b-col class="align-right">{{shippingPrice.currency}} {{shippingPrice.amount}}</b-col>
      </b-row>

      <b-row>
        <!-- <hr> -->
        <b-col cols="8">
          <strong>Tariff Charge</strong>
        </b-col>
        <b-col class="align-right">{{tariffPrice.currency}} {{tariffPrice.amount}}</b-col>
      </b-row>

      <br>
      <b-row>
        <!-- <hr> -->
        <b-col cols="8">
          <strong>Total</strong>
        </b-col>
        <b-col class="align-right"><strong>{{cartTotal.currency}} {{cartTotal.amount}}</strong></b-col>
      </b-row>
    </div>

    <div v-if="orders && orders.length <= 0" class="order-empty">
      <div class="content">
        <div>You have not ordered yet.
          <br>
          <br>
          <b-button @click="gotoDealPage()" class="primary-button">Go Get Orderin</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OrderDetail',
  data() {
    return {
      editMode: true,
      selectedItems: [],
      countOptions: [],
    };
  },

  created() {
    this.countOptions = Array.from(Array(200).keys(), val => val + 1);
  },

  methods: {
    orderPicture(img) {
      return {
        'background-image': `url(${img})`,
        width: '100%',
        height: '70px',
        'background-size': 'contain',
        'background-repeat': 'no-repeat',
      };
    },

    gotoDealPage() {
      this.$router.push('/');
    },

    async gotoProduct(pid) {
      if (!pid) return;
      // await this.done();
      this.$router.push(`/products/${pid}`);
    },

    editOrder() {
      this.editMode = true;
    },

    itemClicked(item) {
      // Replace with product ID.
      const foundIndex = _.findIndex(this.selectedItems, item);

      if (foundIndex < 0) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(foundIndex, 1);
      }
    },

    async updateCartItem(item) {
      if (item.counts > 0) {
        try {
          this.editMode = false;
          const data = await this.$store.dispatch('cartStore/updateOrders', [
            item,
          ]);
          this.editMode = true;
        } catch (err) {
          this.editMode = true;
          this.$notify({
            group: 'all',
            type: 'error',
            text:
              'Cart could not be updated at the moment. Please try again later.',
          });
        }
      }
    },

    async deleteSelected(item) {
      try {
        await this.$store.dispatch('cartStore/deleteOrders', [item]);
      } catch (err) {}
    },
  },

  computed: {
    ...mapGetters({
      orders: 'cartStore/getCart',
      cartTotal: 'cartStore/getTotal',
      subtotal: 'cartStore/getSubTotal',
      serviceCharge: 'cartStore/getServiceCharge',
      shippingPrice: 'cartStore/getShippingPrice',
      tariffPrice: 'cartStore/getTariffPrice',
    }),

    quantityState() {
      return qty => qty >= 1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/global.scss";

.edit-bag {
  font-size: 18px;
  margin-left: 20px;
  color: #bdbdbd;
  cursor: pointer;
}
.delete {
  color: $primary-red;
  cursor: pointer;
}

.total-line {
  padding: 10px;
}
.order-detail {
  margin-top: 30px;
  .order-empty {
    height: 500px;
    line-height: 500px;
    color: #bdbdbd;
    font-size: 1.5em;
    text-align: center;

    .content {
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
    }
  }

  .orders {
    list-style-type: none;
    padding: 0px;
    width: 100%;

    .order-desc {
      cursor: pointer;
    }

    .checkbox-item {
      padding-top: 20px;
    }

    li {
      padding: 10px;
      margin-bottom: 10px;
      width: 100%;

      &:nth-child(even) {
        background: #eeeeee;
      }
    }
  }
}
</style>
