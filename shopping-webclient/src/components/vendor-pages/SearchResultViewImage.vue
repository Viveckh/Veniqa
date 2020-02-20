<template>
  <div id="search-result-view-image">
    <img v-show="!isHover" class="img-cls"
      @mouseover="isHover = true" :src="product.thumbnailUrls[0]"/>
    <img v-show="isHover" class="img-cls"
    @mouseleave="isHover = false"
    :src="product.thumbnailUrls.length > 1 ? product.thumbnailUrls[1] : product.thumbnailUrls[0]" >
  </div>
</template>

<script>
export default {
  name: 'SearchResultViewImage',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isHover: false,
    };
  },

  methods: {
    getPictureStyle() {
      let picture = this.product.thumbnailUrls[0];

      if (this.isHover && this.product.thumbnailUrls.length > 1) {
        // eslint-disable-next-line prefer-destructuring
        picture = this.product.thumbnailUrls[1];
      }
      return {
        'background-image': `url(${picture})`,
        'background-size': 'cover',
        // width: 'auto',
        // height: '350px',
        'margin-bottom': '10px',
      };
    },
  },
};
</script>

<style lang="scss">
#search-result-view-image {
  height: 100%;
  width: 100%;
}
.img-cls {
    border-top-right-radius: 0.25rem;
    border-top-left-radius: 0.25rem;
    height: auto;
    width: 100%;
  }
</style>
