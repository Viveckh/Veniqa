<template>
  <div class="product-detail">
    <div class="space"></div>

    <b-row>
      <b-col md="7">
        <div>
          <product-image-gallery :base-images="productImages" :base-zoomer-options="zoomerOptions"/>
        </div>
      </b-col>
      <b-col md="5">

      </b-col>
    </b-row>
  </div>
</template>

<script>
import ProxyUrls from "@/constants/ProxyUrls";
import JSONFile from "@/assets/json/product.json";
import ProductImageGallery from '@/components/ProductImageGallery';

export default {
  name: "ProductDetail",
  components: {
    ProductImageGallery
  },
  props: {
    productId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      product: null,
      zoomerOptions: {
        zoomFactor: 3,
        pane: "pane",
        hoverDelay: 300,
        namespace: "zoomer",
        move_by_click: false,
        scroll_items: 4,
        choosed_thumb_border_color: "#2c3e50"
      },

      productImages: {
        'normal_size': []
      }
    };
  },

  async created() {
    if (this.productId) {
      // try {
      //   const { data } = await this.$axios({
      //     url: ProxyUrls.getProductDefinitionUrl + this.productId,
      //     type: 'get',
      //   });
      //   if (data) {
      //     this.product = data;
      //   }
      // } catch (err) {
      //   this.$notify({
      //     group: 'all',
      //     type: 'error',
      //     text:
      //       'Product detail could not be retrieved at the moment. Please try again later.',
      //   });
      // }

      this.product = JSONFile;

      this.product.picture_urls.forEach((picture,pid) => {
        this.productImages.normal_size.push({
          id: pid,
          url: picture,
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.product-detail {
  width: 90%;
  margin: auto;
  margin-bottom: 10px;
}
</style>
