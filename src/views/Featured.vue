<template>
  <div id="featured">
    <!-- Product search -->
    <b-form-group>
      <b-form-input
        id="search"
        type="text"
        name="search"
        v-model="searchText"
        placeholder="Search for the product"
        size="sm"
        @keyup.enter.native="searchForProduct()"
      ></b-form-input>
    </b-form-group>

    <!-- Search Result -->
    <div v-if="products.length > 0" class="section">
      <h4>Search Result</h4>
      <div class="search-result">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Manufacturer</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prd, pind) in products" v-bind:key="pind">
              <td>{{prd.name}}</td>
              <td>{{prd.brand}}</td>
              <td>{{prd.store}}</td>
              <td>{{prd.price.amount}}</td>
              <td>
                <b-btn size="sm" variant="success" @click="selectProduct(prd)">Select</b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Selected Products -->
    <div v-if="featuredProducts.length > 0" class="section">
      <hr>
      <h4>Selected Products</h4>
      <b-btn size="sm" variant="success" @click="previewAll()" style="margin-bottom: 10px">Preview All</b-btn>
      <div class="search-result">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Manufacturer</th>
              <th>Design</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prd, pind) in featuredProducts" v-bind:key="pind">
              <td>{{prd.name}}</td>
              <td>{{prd.brand}}</td>
              <td>{{prd.store}}</td>
              <td>
                <b-form-select
                  v-model="prd.design"
                  :options="allDesigns"
                  class="mb-3"
                  size="sm"
                  id="category"
                  name="category"
                />
              </td>
              <td>
                <b-btn size="sm" variant="danger" @click="removeProduct(pind)">Remove</b-btn>
                <b-btn
                  size="sm"
                  variant="success"
                  style="margin-left: 10px;"
                  @click="previewProductModal(prd)"
                >Preview</b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Display how it looks -->
    <div class="preview section" v-if="showPreview || showPreviewAll">
      <hr>
      <h4>Preview</h4>
      <featured-product-view v-if="showPreview" :product="previewProduct" :type="extractDesign"/>

      <div v-if="showPreviewAll">
        <div v-for="(prd, pid) in featuredProducts" v-bind:key="pid">
          <featured-product-view :product="prd" :type="extractDesignWithId(prd.design)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import FeaturedDTO from '@/dto/FeaturedProduct';
import FeaturedProductView from '@/components/homepage/FeaturedProductView';

export default {
  name: 'Featured',
  components: {
    FeaturedProductView,
  },
  data() {
    return {
      searchText: '',
      products: [],
      showPreview: false,
      showPreviewAll: false,
      previewProduct: null,

      featuredProducts: [],
      allDesigns: [
        '1 - Single Image Right',
        '2 - Single Image Left',
        '3 - Two Images Right',
        '3 - Two Images Left',
      ],
    };
  },

  methods: {
    previewProductModal(prd) {
      this.previewProduct = prd;
      this.showPreview = true;
    },

    previewAll() {
      this.previewProduct = null;
      this.showPreview = false;
      this.showPreviewAll = true;
    },

    extractDesignWithId(id) {
      const val = id.split(' - ');
      return parseInt(val[0]);
    },
    async searchForProduct() {
      try {
        const data = await this.$store.dispatch('adminStore/getAllProducts');
        this.products = [];
        this.products.push(...data);
      } catch (err) {
        console.log('Error occured', err);
      }
    },

    async selectProduct(product) {
      try {
        const data = await this.$store.dispatch(
          'adminStore/getProduct',
          product._id,
        );

        const selected = {};
        selected._id = data._id;
        selected.design = this.allDesigns[0];
        selected.name = data.name;
        selected.store = data.store;
        selected.brand = data.brand;
        selected.price = data.price;
        selected.detailedImageUrls = data.detailedImageUrls;

        this.featuredProducts.push(selected);
      } catch (err) {
        console.log('Error occured', err);
      }
    },

    removeProduct(ind) {
      if (this.previewProduct && this.featuredProducts[ind]._id === this.previewProduct._id) {
        this.previewProduct = null;
        this.showPreview = false;
      }
      this.featuredProducts.splice(ind, 1);
    },
  },

  computed: {
    extractDesign() {
      if (this.previewProduct) {
        const val = this.previewProduct.design.split(' - ');
        return parseInt(val[0]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#featured {
  padding: 10px 10px;
  width: 100%;

  h4 {
    text-align: center;
  }
  .search-result {
    max-height: 250px;
    overflow-y: scroll;
  }

  .section {
    margin: 30px 0px;
  }
}
</style>
