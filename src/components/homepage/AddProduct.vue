
<template>
  <div>
    <manage-photo
      v-show="showManagePhoto"
      ref="managephoto"
      :detailedUrls="product.detailedImageUrls"
      :thumbnailPropUrls="product.thumbnailUrls"
      :featuredUrls="product.featuredUrls"
      :productId="product._id"
      :preassignedUrls="preassignedUrls"
      @complete="imageUploadComplete"
      @cancel="showManagePhoto = false"
    />

    <div v-if="!showManagePhoto">
      <div class="product-head">
        <b-row>
          <b-col>
            <h2>Products</h2>
          </b-col>
          <b-col>
            <div class="align-right">
              <button class="btn btn-primary" @click="showManagePhoto = true">Manage Images</button>
            </div>
          </b-col>
        </b-row>
      </div>

      <br>

      <div>
        <b-form-group horizontal :label-cols="2" label="Product Name" label-for="productName">
          <b-form-input
            id="productName"
            type="text"
            name="productName"
            :state="productNameState"
            v-model="product.name"
            placeholder="Enter name of the product"
            aria-describedby="productNameFeedback"
            size="sm"
          ></b-form-input>
          <b-form-invalid-feedback id="productNameFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- This is for store -->
        <b-form-group horizontal :label-cols="2" label="Store" label-for="store">
          <b-form-select
            v-model="product.store"
            :options="refdata.stores"
            class="mb-3"
            size="sm"
            id="store"
            name="store"
            :state="storeState"
            aria-describedby="storeFeedback"
          />

          <b-form-invalid-feedback id="storeFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Brand -->
        <b-form-group horizontal :label-cols="2" label="Brand" label-for="brand">
          <b-form-input
            id="brand"
            type="text"
            name="brand"
            :state="brandState"
            v-model="product.brand"
            placeholder="Enter name of the brand"
            aria-describedby="brandFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="brandFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Category -->
        <b-form-group horizontal :label-cols="2" label="Category" label-for="category">
          <b-form-select
            v-model="product.category"
            :options="refdata.categories"
            class="mb-3"
            size="sm"
            id="category"
            name="category"
            :state="categoryState"
            aria-describedby="categoryFeedback"
          />

          <b-form-invalid-feedback id="categoryFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Subcategory -->
        <b-form-group horizontal :label-cols="2" label="Sub Category" label-for="subcategory">
          <b-form-select
            v-model="product.subcategory"
            :options="getSubCategory()"
            class="mb-3"
            size="sm"
            id="subcategory"
            name="subcategory"
            :state="subcategoryState"
            aria-describedby="subcategoryFeedback"
          />

          <b-form-invalid-feedback id="subcategoryFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Price -->
        <b-form-group horizontal :label-cols="2" label="Price" label-for="price">
          <b-form-input
            id="price"
            type="number"
            step="0.01"
            name="price"
            :state="priceState"
            v-model="product.price.amount"
            placeholder="Enter the price of the product"
            aria-describedby="priceFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="priceFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty or negative.
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Item URL -->
        <b-form-group horizontal :label-cols="2" label="Item URL" label-for="itemurl">
          <b-form-input
            id="itelurl"
            type="text"
            name="iteurl"
            :state="itemurlState"
            v-model="product.item_url"
            placeholder="Enter the url of the item"
            aria-describedby="itemurlFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="itemurlFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Weight -->
        <b-form-group horizontal :label-cols="2" label="Weight" label-for="weight">
          <b-row>
            <b-col>
              <b-form-input
                id="weight"
                type="number"
                step="0.01"
                name="weight"
                :state="weightState"
                v-model="product.weight.quantity"
                placeholder="Enter the weight of the item"
                aria-describedby="weightFeedback"
                size="sm"
              ></b-form-input>

              <b-form-invalid-feedback id="itemurlFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                This field cannot be empty or negative.
              </b-form-invalid-feedback>
            </b-col>
            <b-col>
              <b-form-select
                v-model="product.weight.unit"
                :options="refdata.weight_units"
                class="mb-3"
                size="sm"
                id="unit"
                name="unit"
                :state="unitState"
                aria-describedby="unitFeedback"
              />

              <b-form-invalid-feedback id="unitFeedback">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                This field cannot be empty
              </b-form-invalid-feedback>
            </b-col>
          </b-row>
        </b-form-group>

        <!-- Details -->
        <b-form-group horizontal :label-cols="2" label="Details" label-for="details">
          <b-form-textarea
            id="details"
            v-model="product.details_html"
            placeholder="Enter details"
            :rows="3"
            :max-rows="6"
          />
        </b-form-group>
      </div>

      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <button
            v-if="this.data != null"
            type="button"
            @click="handleEditProduct()"
            class="btn btn-success"
          >Edit Product</button>
          <button
            v-else
            type="button"
            @click="handleAddProduct()"
            class="btn btn-success"
          >Add Product</button>
          &nbsp;
          <button type="button" class="btn btn-danger" @click="goBack()">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
import ManagePhoto from '@/components/homepage/ManagePhoto';

export default {
  props: {
    data: { required: false, type: Object, default: null },
  },
  components: {
    ManagePhoto,
  },
  created() {
    if (this.data != null) {
      this.product = _.cloneDeep(this.data);
    }
  },
  data() {
    return {
      preassignedUrls: null,
      product: {
        store: 'AMAZON',
        brand: 'BEVERLY HILLS KAY',
        name: 'Amrezy Highlighter',
        item_url:
          'https://www.sephora.com/product/ignited-eyeshadow-palette-P439026?icid2=just%20arrived:p439026:product',
        category: 'Make-Up Kits',
        subcategory: 'Palettes',
        thumbnailUrls: [
          // 'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/910f997478edfa6f1d444169371f1d3149f6113f',
          // 'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/8ebad3add8ef7424eed96cc560c8d135b14f9fb8',
        ],
        featuredImageUrls: [
          // 'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/910f997478edfa6f1d444169371f1d3149f6113f',
        ],
        detailedImageUrls: [
          // 'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/910f997478edfa6f1d444169371f1d3149f6113f',
        ],
        price: {
          amount: 27.99,
          currency: 'USD',
        },
        weight: {
          quantity: 3.2,
          unit: 'OZ',
        },
        custom_attributes: {
          color: 'light brilliant gold',
        },
        details_html:
          'A limited-edition illuminating powder with an ultra-smooth formula and radiant finish.',
        colors: [
          { name: 'Black', hexValue: '#000000' },
          { name: 'Brown', hexValue: '#435ADF' },
        ],
        sizes: ['XS', 'S', 'M', 'L'],
      },

      showManagePhoto: false,
      images: null,
    };
  },
  computed: {
    refdata() {
      return this.$store.getters['adminStore/allStateData'];
    },

    productNameState() {
      return this.product.name.length > 0;
    },

    storeState() {
      return this.product.store.length > 0;
    },

    brandState() {
      return this.product.brand.length > 0;
    },

    categoryState() {
      return this.product.category.length > 0;
    },

    subcategoryState() {
      return this.product.subcategory.length > 0;
    },

    priceState() {
      return this.product.price.amount > 0 && this.product.price.amount != null;
    },

    itemurlState() {
      return this.product.item_url.length > 0;
    },

    weightState() {
      return (
        this.product.weight.quantity > 0 && this.product.weight.quantity != null
      );
    },

    unitState() {
      return this.product.weight.unit.length > 0;
    },
  },
  methods: {
    validateForm() {
      return (
        this.productNameState
        && this.storeState
        && this.brandState
        && this.categoryState
        && this.subcategoryState
        && this.priceState
        && this.itemurlState
        && this.weightState
        && this.unitState
      );
    },
    /**
     * @param {Object} payload
     * {
     *    detailedImageUrls: [list of urls]
     *     featuredImageUrls: [list of urls]
     *     thumbnailUrls: [list of urls]
     * }
     */
    imageUploadComplete(payload) {
      this.showManagePhoto = false;
      _.assign(this.product, payload);
    },
    goBack() {
      this.$emit('cancelTrigger');
    },
    async handleAddProduct() {
      if (!this.validateForm()) return;
      try {
        const saveImageRes = await this.$refs.managephoto.saveAll();
        if (saveImageRes) {
          this.imageUploadComplete(saveImageRes);
          this.preassignedUrls = null;
        }
        await this.$store.dispatch('adminStore/addProduct', this.product);
        this.$emit('cancelTrigger');
      } catch (err) {
        if (err) this.preassignedUrls = err;
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error',
        });
      }
    },
    async handleEditProduct() {
      if (!this.validateForm()) return;
      try {
        const saveImageRes = await this.$refs.managephoto.saveAll();
        if (saveImageRes) {
          this.imageUploadComplete(saveImageRes);
          this.preassignedUrls = null;
        }
        await this.$store.dispatch('adminStore/editProduct', this.product);
        this.$emit('cancelTrigger');
      } catch (err) {
        if (err) this.preassignedUrls = err;
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error',
        });
      }
    },
    getSubCategory() {
      const refState = this.$store.getters['adminStore/allStateData'];
      const x = _.find(refState.refDataPayload.product_categories, {
        name: this.product.category,
      }).subcategories;
      return x;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-head {
  margin-top: 1em;
}
</style>
