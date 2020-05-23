<template>
  <div class="general-padding" id="order-view">
    <h3>Orders</h3>

    <b-tabs pills class="mt-4">
      <b-tab disabled title="Filter by:" title-link-class="pl-0"/>
      <b-tab
        v-for="(tab,tind) in orderStatusTabs"
        :key="tind"
        :title="tab.title"
        :active="orderStatus == tab.value"
        @click="tabClicked(tab.value)"
      />
    </b-tabs>
    <hr/>

    <div class="order-list">
      <b-row>
        <b-col md="6">Per page &nbsp;&nbsp;&nbsp;
          <b-form-select
            v-model="pagination.limit"
            :options="perPageOptions"
            style="max-width: 100px"
            size="sm"
            @change="pageLimitChanged"
          />
        </b-col>
        <b-col md="6">
          <b-pagination
            :total-rows="pagination.total"
            v-model="pagination.page"
            :per-page="pagination.limit"
            @change="pageChanged"
            aria-controls="content_loop"
            align="right"
          />
        </b-col>
      </b-row>
      <order-list/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderList from '@/components/orders/OrderList.vue';

export default {
  name: 'OrdersMainPage',
  components: {
    OrderList,
  },
  data() {
    return {
      perPageOptions: [10, 20, 30, 50, 100],
      orderStatusTabs: [
        {
          title: 'Received',
          value: 'RECEIVED'
        },
        {
          title: 'Confirmed',
          value: 'CONFIRMED'
        },
        {
          title: 'In Progress',
          value: 'IN-PROGRESS'
        },
        {
          title: 'Completed',
          value: 'COMPLETED'
        },
        {
          title: 'Cancelled',
          value: 'CANCELLED'
        },
      ]
    };
  },

  async created() {
    const status = this.orderStatus.trim().length === 0 ? 'RECEIVED' : this.orderStatus;

    this.$store.commit('orderStore/setOrderStatus', status);
    try {
      await this.$store.dispatch(
        'orderStore/getOrdersByStatus',
        status,
      );
    } catch (error) {
      this.$notify({
        group: 'all',
        type: 'error',
        text: `Error occured while getting orders with status: ${status}`,
      });
    }
  },

  methods: {
    tabClicked(tab) {
      this.$store.dispatch('orderStore/getOrdersByStatus', tab);
    },

    async pageLimitChanged(limit) {
      this.pagination.limit = limit;
      this.pageChanged(1);
    },

    async pageChanged(pageNum) {
      this.pagination.page = pageNum;
      await this.$store.dispatch('orderStore/getOrdersByStatus', this.orderStatus);
    },
  },

  computed: {
    ...mapGetters({
      orderStatus: 'orderStore/orderStatus',
      pagination: 'orderStore/pagination'
    }),
  },
};
</script>

<style lang="scss" scoped>
#order-view {
  .order-list {
    padding: 20px 0px;
  }
}
</style>
