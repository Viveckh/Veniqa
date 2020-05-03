
<template>
  <div id="add-product">
    <manage-photo
      v-show="showManagePhoto"
      ref="managephoto"
      :detailedUrls="product.detailedImageUrls"
      :thumbnailPropUrls="product.thumbnailUrls"
      :productId="product._id"
      @cancel="showManagePhoto = false"
    />

    <div v-show="!showManagePhoto">
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

      <br />

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
            v-model="product.category.category"
            class="mb-3"
            size="sm"
            id="category"
            name="category"
            @input="product.category._id = ''"
            :state="categoryState"
            aria-describedby="categoryFeedback"
          >
            <option :value="cat" v-for="(cat,cind) in uniqueCategories" v-bind:key="cind">{{cat}}</option>
          </b-form-select>
          <b-form-invalid-feedback id="categoryFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Subcategory -->
        <b-form-group horizontal :label-cols="2" label="Sub Category" label-for="subcategory">
          <b-form-select
            v-model="product.category._id"
            class="mb-3"
            size="sm"
            id="subcategory"
            name="subcategory"
            :state="subcategoryState"
            aria-describedby="subcategoryFeedback"
          >
            <option
              :value="sub._id"
              v-for="(sub, sid) in filteredSubcategories"
              v-bind:key="sid"
            >{{sub.subcategory}}</option>
          </b-form-select>

          <b-form-invalid-feedback id="subcategoryFeedback">This field cannot be empty</b-form-invalid-feedback>
        </b-form-group>

        <!-- Marked Price -->
        <b-form-group horizontal :label-cols="2" label="Marked Price" label-for="markedprice">
          <b-form-input
            id="markedprice"
            type="number"
            step="0.01"
            name="markedprice"
            v-model="product.marked_price.amount"
            placeholder="Enter the marked price of the product"
            size="sm"
          ></b-form-input>
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

        <b-form-group horizontal :label-cols="2" label="Tariff Category" label-for="tariffcategory">
          <b-form-select
            v-model="product.tariff"
            class="mb-3"
            size="sm"
            id="tariffcategory"
            name="tariffcategory"
            :state="tariffState"
            aria-describedby="tariffFeedback"
          >
            <option
              v-for="(tariff, tid) in tariffCategories"
              v-bind:key="tid"
              :value="tariff._id"
            >{{tariff.name}}</option>
          </b-form-select>

          <b-form-invalid-feedback id="tariffFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- SKU -->
        <b-form-group horizontal :label-cols="2" label="Store SKU" label-for="sku">
          <b-form-input
            id="sku"
            type="text"
            name="sku"
            :state="skuState"
            v-model="product.store_sku"
            placeholder="Enter the SKU of store"
            aria-describedby="storeSKUFeedback"
            size="sm"
          ></b-form-input>

          <b-form-invalid-feedback id="storeSKUFeedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            This field cannot be empty.
          </b-form-invalid-feedback>
        </b-form-group>

        <div></div>

        <b-form-group horizontal :label-cols="2" label="Active" label-for="sku">
          <toggle-button v-model="product.active" :labels="{checked: 'Yes', unchecked: 'No'}" />
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

        <b-form-group horizontal :label-cols="2" label="Attributes">
          <b-btn size="sm" @click="showAttributes = true">Add Attributes</b-btn>

          <table
            class="table table-sm attrib-table"
            v-if="product.customizationOptions.customizations && product.customizationOptions.customizations.length > 0"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Type</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(attrib, aind) in product.customizationOptions.customizations"
                v-bind:key="aind"
              >
                <td>{{attrib.name}}</td>
                <td>{{attrib.key}}</td>
                <td>{{attrib.type}}</td>
                <td v-if="attrib.type ==='Colors'">{{extractColorValues(attrib)}}</td>
                <td v-else>{{attrib.values ? attrib.values.join(" , ") : ""}}</td>
              </tr>
            </tbody>
          </table>

          <b-modal
            v-model="showAttributes"
            centered
            id="modal1"
            title="Add Attributes"
            hide-footer
            size="lg"
          >
            <custom-attributes
              v-if="showAttributes"
              :propValue="product.customizationOptions.customizations"
              @cancel="cancelAttribModal"
              @save="saveAttributes"
            />
          </b-modal>
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
          <!-- <b-form-textarea
            id="details"
            v-model="product.details_html"
            placeholder="Enter details"
            :rows="3"
            :max-rows="6"
          />-->
          <editor-menu-bar :editor="editor">
            <div class="menubar" slot-scope="{ commands, isActive }">
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <font-awesome-icon icon="bold" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <font-awesome-icon icon="italic" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
              >
                <font-awesome-icon icon="strikethrough" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
              >
                <font-awesome-icon icon="underline" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.code() }"
                @click="commands.code"
              >
                <font-awesome-icon icon="code" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.paragraph() }"
                @click="commands.paragraph"
              >
                <font-awesome-icon icon="paragraph" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >H1</button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >H2</button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
              >H3</button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <font-awesome-icon icon="list-ul" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <font-awesome-icon icon="list-ol" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.blockquote() }"
                @click="commands.blockquote"
              >
                <font-awesome-icon icon="quote-left" />
              </button>

              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.code_block() }"
                @click="commands.code_block"
              >
                <font-awesome-icon icon="code" />
              </button>

              <button class="menubar__button" @click="commands.undo">
                <font-awesome-icon icon="undo" />
              </button>

              <button class="menubar__button" @click="commands.redo">
                <font-awesome-icon icon="redo" />
              </button>
            </div>
          </editor-menu-bar>
          <editor-content class="editor__content" :editor="editor" />
        </b-form-group>
      </div>

      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <button
            v-if="this.data != null"
            type="button"
            @click="handleEditProduct()"
            class="btn btn-success btn-sm"
          >Edit Product</button>
          <button
            v-else
            type="button"
            @click="handleAddProduct()"
            class="btn btn-success btn-sm"
          >Add Product</button>
          &nbsp;
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="goBack()"
          >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash';
import ManagePhoto from '@/components/homepage/ManagePhoto.vue';
import CustomAttributes from '@/components/homepage/CustomAttributes.vue';
// Import the editor
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { mapGetters } from 'vuex';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions';

export default {
  props: {
    data: { required: false, type: Object, default: null }
  },
  components: {
    ManagePhoto,
    EditorContent,
    EditorMenuBar,
    CustomAttributes
  },
  created() {
    if (this.data != null) {
      // Assign in assigns the values from data to product. This helps reduce the undefined errors by keeping the
      // defaults of product.
      this.product = _.assignIn(this.product, this.data);
      // this.product = _.cloneDeep(this.data);
      this.product.tariff = this.product.tariff._id;
    }
  },
  data() {
    return {
      showAttributes: false,
      editor: null,
      // preassignedUrls: null,
      product: {
        store: 'AMAZON',
        brand: 'BEVERLY HILLS KAY',
        name: 'Amrezy Highlighter',
        item_url:
          'https://www.sephora.com/product/ignited-eyeshadow-palette-P439026?icid2=just%20arrived:p439026:product',
        category: {
          _id: null,
          category: null,
          subcategory: null
        },
        store_sku: null,
        marked_price: {
          amount: 0,
          currency: 'USD'
        },
        active: true,
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
          currency: 'USD'
        },
        tariff: null,
        weight: {
          quantity: 3.2,
          unit: 'LB'
        },
        custom_attributes: {},
        customizationOptions: {
          customizations: []
        },
        details_html: 'A limited-edition illuminating powder with an ultra-smooth formula and radiant finish.',
        colors: [
          { name: 'Black', hexValue: '#000000' },
          { name: 'Brown', hexValue: '#435ADF' }
        ],
        sizes: ['XS', 'S', 'M', 'L']
      },

      showManagePhoto: false,
      images: null
    };
  },

  mounted() {
    this.editor = new Editor({
      content: this.product.details_html,
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Bold(),
        new Code(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new History()
      ],

      onUpdate: ({ getHTML }) => {
        // this.json = getJSON()
        this.product.details_html = getHTML();
      }
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  computed: {
    refdata() {
      return this.$store.getters['adminStore/allStateData'];
    },

    ...mapGetters({
      tariffCategories: 'adminStore/tariffCategories'
    }),

    tariffState() {
      if (this.product.tariff == null) return null;
      return this.product.tariff.length > 0;
    },

    skuState() {
      if (this.product.store_sku == null) return null;
      return this.product.store_sku.length > 0;
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
      if (this.product.category.category === undefined || this.product.category.category == null) {
        return null;
      }
      return this.product.category.category.length > 0;
    },

    subcategoryState() {
      if (this.product.category._id === undefined || this.product.category._id == null) {
        return null;
      }
      return this.product.category._id.length > 0;
    },

    priceState() {
      return this.product.price.amount > 0 && this.product.price.amount != null;
    },

    itemurlState() {
      return this.product.item_url.length > 0;
    },

    weightState() {
      return this.product.weight.quantity > 0 && this.product.weight.quantity != null;
    },

    unitState() {
      return this.product.weight.unit.length > 0;
    },

    uniqueCategories() {
      return [...new Set(this.refdata.categories.map(item => item.category))];
    },

    filteredSubcategories() {
      if (this.product.category.category == null) {
        return _.map(this.refdata.categories, 'subcategory');
      }
      const val = this.refdata.categories.filter(item => {
        if (item.category === this.product.category.category) return true;
        return false;
      });
      return val;
    }
  },
  methods: {
    extractColorValues(attribute) {
      return _.map(attribute.values, 'name').join(' , ');
    },
    validateForm() {
      if (this.tariffState == null) {
        this.product.tariff = '';
      }
      if (!this.categoryState) {
        this.product.category.category = '';
      }
      this.product.store_sku = this.skuState == null ? '' : this.product.store_sku;

      if (!this.subcategoryState) this.product.category._id = '';
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
        && this.tariffState
        && this.skuState
      );
    },

    cancelAttribModal() {
      this.showAttributes = false;
    },

    saveAttributes(attribs) {
      this.product.customizationOptions.customizations = [];
      this.product.customizationOptions.customizations.push(...attribs);
      this.showAttributes = false;
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
      const totalImages = this.$refs.managephoto.configureParams().numberOfThumbnailAndDetailedImages;
      if (totalImages <= 0) {
        this.$notify({
          group: 'all',
          type: 'warn',
          text: 'You need to upload at least 1 image.'
        });
        return;
      }
      try {
        const saveImageRes = await this.$refs.managephoto.saveAll();
        if (saveImageRes) {
          this.imageUploadComplete(saveImageRes);
          // this.preassignedUrls = null;
        }

        await this.$store.dispatch('adminStore/addProduct', this.product);
        this.$emit('cancelTrigger');
      } catch (err) {
        // if (err) this.preassignedUrls = null;
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error'
        });
      }
    },
    async handleEditProduct() {
      if (!this.validateForm()) return;

      // Check if there are any images.
      const totalImages = this.$refs.managephoto.configureParams().numberOfThumbnailAndDetailedImages;
      if (totalImages <= 0) {
        this.$notify({
          group: 'all',
          type: 'warn',
          text: 'You need to upload at least 1 image.'
        });
        return;
      }
      try {
        const saveImageRes = await this.$refs.managephoto.saveAll();
        if (saveImageRes) {
          this.imageUploadComplete(saveImageRes);
          // this.preassignedUrls = null;
        }
        await this.$store.dispatch('adminStore/editProduct', this.product);
        this.$store.commit('adminStore/resetProducts');
        this.$emit('cancelTrigger');
      } catch (err) {
        // if (err) this.preassignedUrls = err;
        this.$notify({
          group: 'all',
          type: 'error',
          text: 'There was an error'
        });
      }
    },
    getSubCategory() {
      const refState = this.$store.getters['adminStore/allStateData'];
      const x = _.find(refState.refDataPayload.product_categories, {
        name: this.product.category
      }).subcategories;
      return x;
    }
  }
};
</script>

<style lang="scss" >
.product-head {
  margin-top: 1em;
}

#add-product {
  .modal-dialog {
    max-width: 80% !important;
  }
}

.attrib-table {
  font-size: 0.875rem;
  margin: 10px 0px;
}

.menubar {
  margin-bottom: 1rem;
  -webkit-transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
}

.menubar__button {
  font-weight: 700;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  background: rgba(0, 0, 0, 0);
  border: 0;
  color: #000;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;

  &.is-active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.editor__content {
  padding: 0.5rem 0.5rem;
  border-radius: 0.2rem;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;

  .ProseMirror:focus,
  .ProseMirror-focused {
    outline: none !important;
  }

  p {
    font-family: unset;
    font-size: 0.875rem;
    font-weight: unset;
    line-height: 1em;
    color: unset;
    margin-bottom: 0px !important;
  }
}
</style>
