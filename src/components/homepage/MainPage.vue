// src/pages/Admin/Products
<template>
  <div class="col-md-12">
    <div v-if="!isAddView">
      <div class="card">
        <header class="card-header">
          <div class="row">
            <div class="col-3">
              <h4 class="card-title mt-2">Catalog</h4>
            </div>

            <div class="col-9 align-right">
              <button
                type="button"
                class="au-btn au-btn-icon au-btn--green"
                @click="addProductFunc()"
                v-if="permissionGranted"
              >+ Add Catalog</button>
            </div>
          </div>
        </header>
        <article class="card-body">
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
          <div>
            <div class="row">
              <div class="col-sm align-left">
                <input
                  class="form-control"
                  v-model="query"
                  type="text"
                  placeholder="Search Catalogs"
                >
              </div>
              <div class="col-sm align-right">
                <b-form-checkbox
                  id="checkbox1"
                  v-model="hideInactive"
                  value="hide"
                  unchecked-value="show"
                >Hide Inactive Items</b-form-checkbox>
              </div>
            </div>
          </div>

          <table class="table table-striped" id="content_loop" style="margin-top: 10px">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>

                <th>SKU</th>
                <th>Price</th>
                <th>Vendor</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="products.length > 0">
              <tr
                v-for="(product, pid) in products"
                v-bind:key="pid"
                v-if="product.name.toUpperCase().includes(query.toUpperCase())
                && !(product.active == false && hideInactive == 'hide')"
              >
                <td>
                  <img
                    :src="product.thumbnailUrls[0]"
                    class="productTableImg"
                    crossorigin="anonymous"
                  >
                </td>

                <td>{{product.name}}</td>
                <td>{{product.store_sku}}</td>
                <td>${{product.price.amount}}</td>

                <td>{{product.store}}</td>
                <td>
                  <span v-if="product.active">Active</span>
                  <span v-else>Inactive</span>
                </td>
                <td>
                  <a @click="editProductFunc(product._id)" v-if="permissionGranted">
                    <i class="fa fa-edit" style="color:green"></i>
                  </a>
                </td>
                <td>
                  <a @click="deleteProduct(product._id)" v-if="permissionGranted">
                    <i class="fa fa-trash" style="color:red"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <b-pagination
            :total-rows="pagination.total"
            v-model="pagination.page"
            :per-page="pagination.limit"
            @change="pageChanged"
            aria-controls="content_loop"
            align="right"
          />
        </article>
        <!-- card-body end .// -->
      </div>
    </div>
    <add-product v-if="isAddView" @cancelTrigger="isAddView=false" :data="editProductData"/>
  </div>
</template>

<script>
import AddProduct from '@/components/homepage/AddProduct.vue';
import Permission from '@/constants/permissions';
import { mapGetters } from 'vuex';

export default {
  components: {
    AddProduct,
  },
  data() {
    return {
      isAddView: false,
      editProductData: null,
      hideInactive: 'hide',
      query: '',
      perPageOptions: [1, 10, 20, 30, 50],
    };
  },
  async created() {
    try {
      await this.$store.dispatch('adminStore/getAllProducts');
      await this.$store.dispatch('adminStore/getReferenceData');
    } catch (error) {
      this.$router.push('/login');
    }
  },
  computed: {
    products() {
      return this.$store.getters['adminStore/allProducts'];
    },

    permissionGranted() {
      if (this.permissions.indexOf(Permission.SUPERADMIN) >= 0) return true;
      return (
        this.permissions
        && this.permissions.indexOf(Permission.ORDER_MANAGE) >= 0
      );
    },

    ...mapGetters({
      permissions: 'authStore/permissions',
      pagination: 'adminStore/pagination',
    }),
  },
  methods: {
    async pageChanged(pageNum) {
      this.pagination.page = pageNum;
      await this.$store.dispatch('adminStore/getAllProducts');
    },

    async pageLimitChanged(limit) {
      this.pagination.limit = limit;
      this.pageChanged(1);
      // await this.$store.dispatch("adminStore/getAllProducts");
    },
    deleteProduct(id) {
      return this.$store.dispatch('adminStore/deleteProduct', id);
    },
    addProductFunc() {
      this.isAddView = true;
      this.editProductData = null;
    },
    async editProductFunc(id) {
      const editProductDetails = await this.$store.dispatch(
        'adminStore/getProduct',
        id,
      );
      this.editProductData = editProductDetails;
      console.log(this.editProductData);
      this.isAddView = true;
    },
  },
};
</script>
<style>
.productTableImg {
  height: 75px;
  widows: 75px;
  border: 1px;
  border-color: cadetblue;
}
</style>


<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
