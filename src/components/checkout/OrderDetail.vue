<template>
  <div class="order-detail align-left">
    <h3>
      Your Order
      <span class="edit-bag">Edit Bag</span>
    </h3>
    <hr>
    <ul class="orders">
      <li v-for="(item, itemIndex) in orders" v-bind:key="itemIndex">
        <b-row>
          <b-col md="3">
            <div
              class="order-img"
              v-if="item.picture_urls.length > 0"
              :style="orderPicture(item.picture_urls[0])"
            ></div>
          </b-col>
          <b-col md="5" class="hello">
            {{item.name}}
            <br>
            <span style="font-size: 12px">Standard Shipping</span>
          </b-col>
          <b-col>{{item.quantity}}</b-col>
          <b-col>$ {{item.price}}</b-col>
        </b-row>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OrderDetail',
  data() {
    return {};
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
  },

  computed: {
    ...mapGetters({
      orders: 'cartStore/getCart',
    }),
  },
};
</script>

<style lang="scss" scoped>
.edit-bag {
  font-size: 18px;
  margin-left: 20px;
  color: #bdbdbd;
  cursor: pointer;
}

.order-detail {
  .orders {
    list-style-type: none;
    padding: 0px;
    width: 100%;

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
