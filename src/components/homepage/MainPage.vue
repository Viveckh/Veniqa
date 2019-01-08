// src/pages/Admin/Products
<template>
  <div class="col-md-10">
    <div v-if="!isAddView">
      <button
        type="button"
        class="btn btn-secondary"
        style="margin:10px;"
        @click="addProductFunc()"
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
        <tbody>
          <tr v-for="product in products" v-if="products.length > 0">
            <td>
              <img :src="product.thumbnailUrls[0]" class="productTableImg">
            </td>
            <td>{{product.name}}</td>
            <td>${{product.price.amount}}</td>
            <td>{{product.store}}</td>
            <td>
              <a @click="editProductFunc(product._id)">
                <i class="fa fa-edit" style="color:green"></i>
              </a>
            </td>
            <td>
              <a @click="deleteProduct(product._id)">
                <i class="fa fa-trash" style="color:#FA8072"></i>
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
