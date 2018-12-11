<template>
  <div>
    <br>
    <form class="form-horizontal" @submit.prevent="handleAddProduct">
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="name">Product Name</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="product.name" name="name" type="text">
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="store">Store</label>
        <div class="col-sm-10">
          <select class="select form-control" v-model="product.store" name="store"></select>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="brand">Brand</label>
        <div class="col-sm-10">
          <select class="select form-control" v-model="product.brand" name="brand"></select>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="amount">Price</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="product.price.amount" name="amount" type="text">
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="currency">Currency</label>
        <div class="col-sm-10">
          <select class="select form-control" v-model="product.price.currency" name="currency"></select>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="url">Item Url</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="product.item_url" name="url" type="text">
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="url">Picture URL 1</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="product.thumbnailUrls[0]" name="url" type="text">
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="url1">Picture URL 2</label>
        <div class="col-sm-10">
          <input
            class="form-control"
            v-model="product.featuredImageUrls[0]"
            name="url1"
            type="text"
          >
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="url2">Picture URL 3</label>
        <div class="col-sm-10">
          <input
            class="form-control"
            v-model="product.detailedImageUrls[0]"
            name="url2"
            type="text"
          >
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="quantity">Quantity</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="product.weight.quantity" name="quantity" type="text">
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="unit">Unit</label>
        <div class="col-sm-10">
          <select class="select form-control" v-model="product.weight.unit" name="unit"></select>
        </div>
      </div>
      <div class="form-group form-group-sm">
        <label class="control-label col-sm-2" for="details_html">Details</label>
        <div class="col-sm-10">
          <textarea
            class="form-control"
            cols="40"
            v-model="product.details_html"
            name="details_html"
            rows="5"
          ></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <button type="submit" class="btn btn-success">Add Product</button>
          &nbsp;
          <button type="button" class="btn btn-danger" @click="goBack()">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {
        store: 'AMAZON',
        brand: 'BEVERLY HILLS KAY',
        name: 'Amrezy Highlighter',
        item_url:
          'https://www.sephora.com/product/ignited-eyeshadow-palette-P439026?icid2=just%20arrived:p439026:product',
        category: 'Make-Up Kits',
        subcategory: 'Palettes',
        thumbnailUrls: [
          'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/910f997478edfa6f1d444169371f1d3149f6113f',
          'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/8ebad3add8ef7424eed96cc560c8d135b14f9fb8',
        ],
        featuredImageUrls: [
          'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/910f997478edfa6f1d444169371f1d3149f6113f',
        ],
        detailedImageUrls: [
          'https://s3.amazonaws.com/veniqa-catalog-images/6948edbc43110f0828169a5119e4f0f88436658c/thumbnails/910f997478edfa6f1d444169371f1d3149f6113f',
        ],
        price: {
          amount: 27.99,
          currency: 'USD',
        },
        weight: {
          quantity: 3.2,
          unit: 'LB',
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
    };
  },
  methods: {
    goBack() {
      this.$emit('cancelTrigger');
    },
    handleAddProduct() {
      return this.$store.dispatch('adminStore/addProduct', this.product);
    },
  },
};
</script>

<style>
</style>
