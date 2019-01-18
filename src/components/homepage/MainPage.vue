// src/pages/Admin/Products
<template>
  <div class="col-md-12">
    <div v-if="!isAddView">
      <button
        type="button"
        class="au-btn au-btn-icon au-btn--green"
        style="margin:10px;"
        @click="addProductFunc()"
        v-if="permissionGranted"
      >
        <i class="fa fa-plus"></i>
        Add a Product
      </button>

      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Manufacturer</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody v-if="products.length > 0" >
          <tr v-for="(product, pid) in products" v-bind:key="pid">
            <td>
              <img :src="product.thumbnailUrls[0]" class="productTableImg">
            </td>
            <td>{{product.name}}</td>
            <td>${{product.price.amount}}</td>
            <td>{{product.store}}</td>
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
    </div>
    <add-product v-if="isAddView" @cancelTrigger="isAddView=false" :data="editProductData"/>
  </div>
</template>

<script>
import AddProduct from '@/components/homepage/AddProduct.vue';
import Permission from "@/constants/permissions";
import { mapGetters } from "vuex";

export default {
  components: {
    AddProduct,
  },
  data() {
    return {
      isAddView: false,
      editProductData: null,
    };
  },
  async created() {
    await this.$store.dispatch('adminStore/getAllProducts');
    await this.$store.dispatch('adminStore/getReferenceData');
  },
  computed: {
    products() {
      return this.$store.getters['adminStore/allProducts'];
    },

    permissionGranted() {
      if(this.permissions.indexOf(Permission.SUPERADMIN) >=0) return true;
      return this.permissions && this.permissions.indexOf(Permission.ORDER_MANAGE) >=0;
    },

    ...mapGetters({
      permissions: 'authStore/permissions'
    })
  },
  methods: {
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
