<template>
  <div id="featured">
    <div class="card">
      <header class="card-header">
        <h4 style="text-align: left">Featured Section</h4>
      </header>

      <div id="search-collapse" class="card-body">
        <h5>Selected Featured</h5>
        <!-- Selected Products -->
        <div v-if="featuredProducts.length > 0" class="section">
          <b-btn
            size="sm"
            variant="success"
            @click="previewAll()"
            style="margin-bottom: 10px"
          >Preview All</b-btn>

          &nbsp;&nbsp;
          <b-btn
            size="sm"
            variant="primary"
            @click="saveFeatured()"
            style="margin-bottom: 10px;"
          >
            Save All
          </b-btn>
          <div class="search-result">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Manufacturer</th>
                  <th>Design</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prd, pind) in featuredProducts" v-bind:key="pind">
                  <td>
                    <img :src="prd.detailedImageUrls[0]" alt="Broken" width="60px" height="auto" crossorigin="anonymous">
                  </td>
                  <td>{{prd.name}}</td>
                  <td>{{prd.brand}}</td>
                  <td>{{prd.store}}</td>
                  <td>
                    <b-form-select
                      v-model="prd.design"
                      :options="allDesigns"
                      size="sm"
                      style="max-width: 200px"
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
        <div v-else class="empty-info">
          <p>No Featured images exist</p>
        </div>
        <hr>

        <h5>Search for products</h5>
        <b-row>
          <b-col>
            <b-form-group>
              <b-form-input
                id="search"
                type="text"
                name="search"
                v-model="searchText"
                placeholder="Search for the product"
                size="sm"
                style="max-width: 300px"
                @keyup.enter.native="searchForProduct()"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <!-- Pagination here -->
            <b-pagination
              :total-rows="searchPagination.total"
              v-model="searchPagination.page"
              :per-page="searchPagination.limit"
              @change="pageChanged"
              align="right"
              v-if="products.length > 0"
            />
          </b-col>
        </b-row>

        <!-- Search Result -->
        <div v-if="products.length > 0" class="section">
          <!-- <h4>Search Result</h4> -->
          <div class="search-result">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Manufacturer</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prd, pind) in products" v-bind:key="pind">
                  <td>
                    <img :src="prd.thumbnailUrls[0]" alt="Broken" width="60px" height="auto">
                  </td>
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

        <!-- Pagination here -->
        <b-pagination
          :total-rows="searchPagination.total"
          v-model="searchPagination.page"
          :per-page="searchPagination.limit"
          @change="pageChanged"
          align="right"
          v-if="products.length > 0"
        />

        <!-- Product search -->
        <hr>

        <!-- Display how it looks -->
        <div class="preview section" v-if="showPreview || showPreviewAll">
          <hr>
          <h4>Preview</h4>
          <featured-product-view
            v-if="showPreview"
            :product="previewProduct"
            :type="extractDesign"
          />

          <div v-if="showPreviewAll">
            <div v-for="(prd, pid) in featuredProducts" v-bind:key="pid">
              <featured-product-view :product="prd" :type="extractDesignWithId(prd.design)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import FeaturedDTO from '@/dto/FeaturedProduct';
import FeaturedProductView from '@/components/homepage/FeaturedProductView';
import Pagination from '@/dto/Pagination';
import FeatureService from '@/services/FeatureService';
import notify from '@/services/NotificationService';

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

      allFeatured: [],
      currentSection: 'homepage',

      searchPagination: _.cloneDeep(Pagination),
    };
  },

  async created() {
    // Load all the existing feature list.
    try {
      const data = await FeatureService.getAllFeaturedList(this.currentSection);
      this.featuredProducts = data;
    } catch (error) {
      console.log('Feature get error');
    }
  },

  methods: {
    async saveFeatured() {
      const preparedReq = FeatureService.prepareRequest(this.currentSection, this.featuredProducts);

      try {
        const data = await FeatureService.saveFeaturedPosts(preparedReq);
        if (data) {
          // this.featuredProducts = data;

          notify.success(this, 'Saved Successfully');
        }
      } catch (error) {
        notify.error(this, 'Error occured while saving');
      }
    },
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
        const data = await this.$store.dispatch('adminStore/getAllProducts', {
          searchTerm: this.searchText,
          pagingOptions: this.searchPagination,
        });
        this.products = [];
        this.products.push(...data.docs);
        this.searchPagination.total = data.total;
        this.searchPagination.limit = data.limit;
        this.searchPagination.page = data.page;
      } catch (err) {
        console.log('Error occured', err);
      }
    },

    async pageChanged(pageNum) {
      this.searchPagination.page = pageNum;
      await this.searchForProduct();
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
      if (
        this.previewProduct
        && this.featuredProducts[ind]._id === this.previewProduct._id
      ) {
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

    td {
      vertical-align: middle;
    }
  }

  .section {
    margin: 30px 0px;
  }
}
</style>
