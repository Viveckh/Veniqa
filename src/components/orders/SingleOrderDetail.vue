<template>
  <div id="single-order-detail" class="align-left">
    <div class="space"></div>
    <div v-if="order">
      <h4>Your Order Detail</h4>

      <b-card-group deck class="mb-3">
        <b-card bg-variant="light" header="Order Status">
          <div class="card-text card-font">
            <p>
              <!-- Status goes here -->
              Status:
              <span
                v-bind:class="{'green': order.overall_status != 'CANCELLED', 'red': order.overall_status === 'CANCELLED'}"
              >
                <strong>{{order.overall_status}}</strong>
              </span>
            </p>

            <p>
              <strong>Order #</strong>
              {{order._id}}
            </p>
            <p>
              <strong>Order placed on</strong>
              {{order.auditLog.createdOn | formattedDate}}
            </p>
          </div>
        </b-card>

        <b-card bg-variant="light" header="Shipping Address" v-if="addr">
          <div class="card-text">
            <p>
              {{addr.firstName}} {{addr.lastName}}
              <br>
              {{addr.addressLine1}}
              <br>
              <span v-if="addr.addressLine2">
                {{addr.addressLine2}}
                <br>
              </span>
              {{addr.city}}, {{addr.state}}
              <br>
              {{addr.country}} {{addr.zipCode}}
              <br>

              {{addr.mobilePhone}}
            </p>
          </div>
        </b-card>

        <b-card bg-variant="light" header="Payment Method" v-if="payment">
          <div class="card-text">
            <p>
              <strong>{{payment.source}}</strong>
              <br>
              {{payment.amount_in_payment_currency.amount}} {{payment.amount_in_payment_currency.currency}}
            </p>
          </div>
        </b-card>
      </b-card-group>

      <div class="cart-items">
        <h5>Cart Items</h5>
        <br>
        <div v-for="(item, iind) in order.cart.items" v-bind:key="iind">
          <single-order-item :item="item"/>
          <hr v-if="iind != order.cart.items.length -1">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProxyUrls from '@/constants/ProxyUrls';
import notification from '@/services/NotificationService';
import moment from 'moment';
import SingleOrderItem from '@/components/orders/SingleOrderItem';

export default {
  name: 'SingleOrderDetail',
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  components: {
    SingleOrderItem,
  },

  data() {
    return {
      order: null,
    }
  },

  filters: {
    formattedDate(date){
      if(date){
        return moment(date).format("MMMM Do, YYYY");
      }
      else return '';
    }
  },

  async created() {
    this.order = null;

    try {
      const {data} = await this.$axios({
        url: ProxyUrls.orderDetail + this.id,
        method: 'get',
      });

      if(data && data.httpStatus === 200){
        this.order = data.responseData;
      }
      else {
        throw new Error();
      }
    } catch (error) {
      notification.error(this, 'Could not open the details page at the moment', 'all');
      this.$router.push('/orders');
    }
  },

  computed: {
    addr() {
      return this.order ? this.order.mailing_address : null;
    },

    payment() {
      return this.order && this.order.payment_info ? this.order.payment_info[0] : null;
    }
  }
}
</script>

<style lang="scss">
#single-order-detail {
  min-height: 90vh;
  width: 70%;
  margin: auto;

  h4 {
    margin-bottom: 2rem;
  }

  .card-font {
    font-size: small;
  }

  .cart-items{
    margin-top: 2rem;
  }
}
</style>

