<template>
  <div class="general-padding" id="order-detail">
    <div v-if="openOrder">
      <h3>
        <a>
          <font-awesome-icon icon="chevron-left" @click="goToOrdersPage()"/>
        </a> Order Details
      </h3>
      <b-card>
        <p class="status">
          <b-row>
            <b-col md="6">
              Order Status:
              <span class="item-status">{{openOrder.overall_status}}</span>
            </b-col>
            <b-col md="6">
              <div class="align-right">
                <b-btn
                  variant="success"
                  size="sm"
                  v-if="openOrder.overall_status === 'RECEIVED' && permissionGranted"
                  @click="showConfirmation = true"
                >Confirm Order</b-btn>
                <b-btn
                  variant="danger"
                  v-if="openOrder.overall_status == 'RECEIVED' && permissionGranted"
                  size="sm"
                  @click="cancelConfirmation = true"
                >Cancel Order</b-btn>
              </div>
            </b-col>
          </b-row>
        </p>

        <b-row>
          <b-col>
            <div>
              <h5>Mailing Address</h5>
              <hr>
              {{addr.firstName}} {{addr.lastName}} <br>
              {{addr.addressLine1}} <br>
              <span v-if="addr.addressLine2">{{addr.addressLine2}}<br></span>
              {{addr.city}} {{addr.state}} <br>
              {{addr.country}} {{addr.zipCode}}
            </div>
          </b-col>
          <b-col>
            <h5>Payment Details</h5>
            <hr>
            <p v-for="(pay, pid) in payments" v-bind:key="pid">
              {{pay.source}} <span class="green" style="font-weight: bold"> {{pay.type}} </span><br>
              Amount in USD: $ {{pay.amount_in_usd.amount}} <br>
              Amount in Local: {{pay.amount_in_payment_currency.amount}} {{pay.amount_in_payment_currency.currency}}
            </p>
          </b-col>
          <b-col>
            <ul class="order-desc">
              <li>
                <strong>Created By:</strong>
                &nbsp;&nbsp;&nbsp;{{openOrder.auditLog.createdBy.name}}
              </li>
              <li>
                <strong>Email:</strong>
                &nbsp;&nbsp;&nbsp;{{openOrder.auditLog.createdBy.email}}
              </li>
              <li>
                <strong>Created On:</strong>
                &nbsp;&nbsp;&nbsp;{{openOrder.auditLog.createdOn | filterDate}}
              </li>
            </ul>

            <ul class="order-desc">
              <li>
                <strong>Updated By:</strong>
                &nbsp;&nbsp;&nbsp;{{openOrder.auditLog.updatedBy.name}}
              </li>
              <li>
                <strong>Email:</strong>
                &nbsp;&nbsp;&nbsp;{{openOrder.auditLog.updatedBy.email}}
              </li>
              <li>
                <strong>Updated On:</strong>
                &nbsp;&nbsp;&nbsp;{{openOrder.auditLog.updatedOn | filterDate}}
              </li>
            </ul>
          </b-col>
        </b-row>
      </b-card>

      <h5>All Ordered Items</h5>
      <hr>

      <div class="order-item-pane">
        <div
          v-for="(item, itemInd) in openOrder.cart.items"
          v-bind:key="itemInd"
          :class="{'list-row': itemInd % 2 == 0}"
        >
          <single-list-item
            :data="item"
            :dataIndex="itemInd+1"
            :orderStatus="openOrder.overall_status"
            :order="openOrder"
          />
        </div>
      </div>

      <comments-section/>
    </div>

    <confirmation-page v-if="showConfirmation" @yes="yesClicked" @no="showConfirmation = false"/>
    <confirmation-page
      v-if="cancelConfirmation"
      text="Are you sure you want to cancel the order?"
      @yes="cancelOrder"
      @no="cancelConfirmation = false"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SingleListItem from '@/components/orders/SingleListItem.vue';
import ConfirmationPage from '@/components/common/ConfirmationPage.vue';
import CommentsSection from '@/components/orders/CommentsSection.vue';
import Permission from '@/constants/permissions';
import moment from 'moment';

export default {
  name: 'OrderDetail',
  components: {
    SingleListItem,
    ConfirmationPage,
    CommentsSection,
  },
  data() {
    return {
      showConfirmation: false,
      cancelConfirmation: false,
    };
  },

  created() {
    if (this.openOrder == null) {
      this.$router.push({ path: '/orders' });
    }
  },

  filters: {
    filterDate(dd) {
      return moment(dd).format('dddd, MMMM Do YYYY, h:mm:ss a');
    }
  },

  methods: {
    async cancelOrder() {
      try {
        const isSuccess = await this.$store.dispatch(
          'orderStore/cancelOrder',
          this.openOrder._id,
        );
        if (isSuccess) {
          this.$router.push({ path: '/orders' });
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'Successfully cancelled the order.',
          });
        } else {
          throw new Error('It wasn not a successful request');
        }
      } catch (error) {
        console.log('Error', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'Error occured while cancelling. Please try again later.',
        });
      }
    },

    async yesClicked() {
      await this.confirmOrder();
      this.showConfirmation = false;
    },

    goToOrdersPage() {
      this.$store.commit('orderStore/setOpenOrder', null);
      this.$router.push({ path: '/orders' });
    },

    async confirmOrder() {
      try {
        const isSuccess = await this.$store.dispatch('orderStore/confirmOrder');

        if (isSuccess) {
          this.$notify({
            group: 'all',
            type: 'success',
            text: 'Order was confirmed.',
          });
        }
      } catch (error) {
        console.log('Error', error);
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'Order could not be confirmed at the moment. Please try again later.',
        });
      }
    },
  },

  computed: {
    ...mapGetters({
      openOrder: 'orderStore/openOrder',
      permissions: 'authStore/permissions',
    }),

    addr() {
      return this.openOrder.mailing_address;
    },

    payments() {
      return this.openOrder.payment_info;
    },

    permissionGranted() {
      if (this.permissions.indexOf(Permission.SUPERADMIN) >= 0) return true;
      return (
        this.permissions
        && this.permissions.indexOf(Permission.ORDER_MANAGE) >= 0
      );
    },
  },
};
</script>

<style lang="scss" scoped>
#order-detail {
  font-size: 0.875rem;

  .order-desc {
    li {
      list-style: none;
    }
  }

  hr {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  .status {
    button {
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  .comments {
    margin-top: 1rem;
  }
}
</style>
