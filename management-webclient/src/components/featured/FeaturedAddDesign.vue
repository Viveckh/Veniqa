<template>
  <div id="add-design">
    <b-modal
      centered
      no-close-on-backdrop
      no-close-on-esc
      title="Add a new Design"
      visible
      ok-title="Add Design"
      hide-footer
      @hide="cancelClicked()"
    >
      <b-row>
        <b-col>
          <label for="design-name">Design Name:</label>
          <b-form-input
            id="design-name"
            type="text"
            size="sm"
            name="design-name"
            :state="designNameState"
            v-model="designObj.config.name"
            aria-describedby="usernameFeedback"
          ></b-form-input>
          <b-form-invalid-feedback id="usernameFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Enter a valid name.
          </b-form-invalid-feedback>
        </b-col>
        <b-col>
          <label for="type">Design Type</label>
          <b-form-select
            v-model="designObj.config.design_type"
            :options="allDesignTypes"
            class="mb-3"
            size="sm"
            id="type"
            name="type"
            @input.native="designTypeChange()"
            :state="designTypeState"
            aria-describedby="typeFeedback"
          />

          <b-form-invalid-feedback id="typeFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Design Type cannot be empty.
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <hr>

      <!-- Start of existing featured products inside a design -->
      <div v-if="designObj.products.length > 0">
        <b-row>
          <b-col>
            <h5>Selected Products</h5>
          </b-col>
          <b-col
            class="align-right"
          >{{designObj.products.length}} of {{designProductLimit}} products selected</b-col>
        </b-row>
        <hr>

        <ul class="inline-list">
          <li v-for="(product, pid) in designObj.products" :key="pid">
            <b-card class="product-card">
              <b-row>
                <b-col sm="4">
                  <img
                    :src="product.detailedImageUrls[0]"
                    alt="Broken"
                    width="60px"
                    height="auto"
                    crossorigin="anonymous"
                  >
                </b-col>
                <b-col style="font-size: small">
                  <strong>{{product.name}}</strong>
                  <br>
                  {{product.brand}}
                  <br>
                  {{product.store}}
                  <br>
                  <a class="red-anchor" @click="removeFeaturedProduct(product)">Remove</a>
                </b-col>
              </b-row>
            </b-card>
          </li>
        </ul>
      </div>
      <!-- End of existing products section -->
      <!-- Search bar to search for products to add -->
      <div>
        <h5>Search for products to add</h5>
        <b-row>
          <b-col>
            <b-form-group>
              <b-form-input
                id="search"
                type="text"
                name="search"
                v-model="searchText"
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
        <!-- End of search bar -->
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
      </div>

      <div class="align-right" v-if="designObj.products.length > 0">
        <hr>
        <b-btn size="sm" variant="secondary" @click="cancelClicked()">Cancel</b-btn>&nbsp;&nbsp;&nbsp;
        <b-btn size="sm" class="primary-button" @click="addDesign()" v-if="!editMode">Add Design</b-btn>
        <b-btn size="sm" class="primary-button" @click="addDesign()" v-else>Edit Design</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>
import FeaturedDTO from '@/dto/FeaturedProductDTO';
import _ from 'lodash';
import { DesignTypes } from '@/config';
import Pagination from '@/dto/Pagination';
import notification from '@/services/NotificationService';

export default {
  name: 'FeaturedAdddesign',
  props: {
    design: {
      required: false,
      type: Object,
    },

    editMode: {
      required: false,
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      designObj: _.cloneDeep(FeaturedDTO),
      allDesignTypes: _.map(DesignTypes, 'type'),
      searchText: '',
      searchPagination: _.cloneDeep(Pagination),
      products: [],
      designProductLimit: 0,
    };
  },

  created() {
    if (this.editMode) {
      this.designObj = _.assignIn(this.designObj, this.design);
      this.designTypeChange();
    }

    this.searchForProduct();
  },

  methods: {
    async designTypeChange() {
      // IDK why this is important but the model isn't updating until the next tick on change.
      await this.$nextTick();

      const found = _.find(DesignTypes, d => d.type === this.designObj.config.design_type);

      if (found) {
        this.designProductLimit = found.productLimit;
        // Also remove extra images from the selected list.
        this.designObj.products.splice(this.designProductLimit, this.designObj.products.length);
      } else {
        this.designProductLimit = 0;
        this.designObj.products = [];
      }
    },

    cancelClicked() {
      this.designObj = null;
      this.$emit('cancel');
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

    async selectProduct(prd) {
      if (!this.designObj.products) this.designObj.products = [];

      // Validate if the number of products for the design type is figured out.
      if (!this.designTypeState) {
        this.designObj.config.design_type = '';
        notification.warn(this, 'Please select the design type before selecting the product');
        return;
      }

      if (this.designObj.products.length >= this.designProductLimit) {
        notification.warn(this, 'The limit of the total products for this design type has been set');
        return;
      }

      if (_.findIndex(this.designObj.products, ['_id', prd._id]) >= 0) {
        notification.warn(this, 'The Product is already selected. Select something else');
      } else {
        try {
          const data = await this.$store.dispatch(
            'adminStore/getProduct',
            prd._id,
          );

          this.designObj.products.push(_.cloneDeep(data));
        } catch (err) {
          console.log('Error occured', err);
        }
      }
    },

    removeFeaturedProduct(product) {
      const ind = _.findIndex(this.designObj.products, p => p._id === product._id);
      if (ind >= 0) {
        this.designObj.products.splice(ind, 1);
      }
    },

    addDesign() {
      if (this.designObj.products.length < this.designProductLimit) {
        notification.warn(this, `You need exactly ${this.designProductLimit} products to add this design`);
        return;
      }
      if (this.editMode) {
        this.$emit('edit', _.cloneDeep(this.designObj));
      } else {
        this.$emit('add', _.cloneDeep(this.designObj));
      }
    },
  },

  computed: {
    designNameState() {
      if (this.designObj.config.name === null) return null;
      return this.designObj.config.name.length > 0;
    },

    designTypeState() {
      if (this.designObj.config.design_type === null) return null;
      return this.designObj.config.design_type.length > 0;
    }
  }
};
</script>

<style lang="scss">
#add-design {
  .modal-dialog {
    max-width: 65%;
  }

  @media (max-width: 768px) {
    .modal-dialog {
      max-width: unset;
    }
  }

  .modal-body {
    min-height: 80vh;
  }

  .inline-list {
    li {
      width: 300px;
      padding: 10px;
    }
  }

  .search-result {
    max-height: 55vh;
    overflow-y: scroll;

    td {
      vertical-align: middle;
    }
  }
}
</style>
