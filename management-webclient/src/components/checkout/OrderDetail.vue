<template>
  <div class="order-detail align-left">
    <h3>
      Your Order
      <span
        class="edit-bag"
        @click="editOrder()"
        v-if="!editMode && orders.length > 0"
      >Edit Bag</span>
      <span
        class="edit-bag delete"
        v-if="editMode && this.orders.length > 0"
        @click="deleteSelected()"
      >Delete</span>
      <span class="edit-bag" v-if="editMode && this.orders.length > 0" @click="done()">Done</span>
    </h3>
    <hr>
    <ul class="orders">
      <li v-for="(item, itemIndex) in orders" v-bind:key="itemIndex">
        <b-row>
          <b-col sm="1" v-if="editMode">
            <b-form-checkbox
              class="checkbox-item"
              :id="'order-'+itemIndex"
              @change.native="itemClicked(item)"
            ></b-form-checkbox>
          </b-col>
          <b-col md="3">
            <div
              class="order-img"
              v-if="item.picture_urls.length > 0"
              :style="orderPicture(item.picture_urls[0])"
            ></div>
          </b-col>
          <b-col md="4">
            {{item.name}}
            <br>
            <span style="font-size: 12px">Standard Shipping</span>
          </b-col>
          <b-col>
            <b-form-input
              v-model="item.counts"
              v-if="editMode"
              :state="quantityState(item.counts)"
              type="number"
              min="1"
              aria-describedby="qtyFeedback"
            ></b-form-input>
            <b-form-invalid-feedback v-if="editMode" id="qtyFeedback">> 0</b-form-invalid-feedback>
            <span v-else>{{item.counts}}</span>
          </b-col>
          <b-col>{{item.price.currency}} {{item.price.amount}}</b-col>
        </b-row>
      </li>
    </ul>

    <div v-if="orders.length <= 0" class="order-empty">
      <div class="content">
        <div>You have not ordered yet.
          <br><br>
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
      editMode: false,
      selectedItems: [],
    };
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

    done() {
      let validated = true;
      for (let i = 0; i < this.orders.length; i += 1) {
        const item = this.orders[i];
        if (!this.quantityState(item.counts)) {
          validated = false;
        }
      }

      if (validated) {
        this.editMode = false;
        this.selectedItems = [];
      }
    },

    async deleteSelected() {
      try {
        await this.$store.dispatch(
          'cartStore/deleteOrders',
          this.selectedItems,
        );
      } catch (err) {
        console.log(err);
      }
      this.selectedItems = [];
    },
  },

  computed: {
    ...mapGetters({
      orders: 'cartStore/getCart',
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

  &.delete {
    color: $primary-red;
  }
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
