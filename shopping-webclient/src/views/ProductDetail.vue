<template>
  <div class="product-detail">
    <div class="space"></div>
    <div v-if="product != null">
      <p class="align-left">Shop &nbsp; / &nbsp; {{product.name}}</p>
      <hr>
      <b-row>
        <b-col md="7" class="beginner">
          <div>
            <product-image-gallery
              :base-images="productImages"
              :base-zoomer-options="zoomerOptions"
            />
          </div>
        </b-col>
        <b-col md="5">
          <product-description :data="product"/>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import ProxyUrls from '@/constants/ProxyUrls';
import ProductImageGallery from '@/components/product-detail/ProductImageGallery.vue';
import ProductDescription from '@/components/product-detail/ProductDescription.vue';

export default {
  name: 'ProductDetail',
  components: {
    ProductImageGallery,
    ProductDescription,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      product: null,
      zoomerOptions: {
        zoomFactor: 1.5,
        pane: 'container',
        hoverDelay: 300,
        namespace: 'zoomer',
        move_by_click: false,
        scroll_items: 4,
        choosed_thumb_border_color: '#2c3e50',
      },

      productImages: {
        normal_size: [],
      },
    };
  },

  async created() {
    if (this.productId) {
      try {
        const { data } = await this.$axios({
          url: ProxyUrls.getProductDefinitionUrl + this.productId,
          type: 'get',
        });
        if (data) {
          data.responseData.counts = 0;
          this.product = data.responseData;
          this.product.detailedImageUrls.forEach((picture, pid) => {
            this.productImages.normal_size.push({
              id: pid,
              url: picture,
            });
          });

          this.product.customValues = {};

          for (
            let i = 0;
            i < this.product.customizationOptions.customizations.length;
            i += 1
          ) {
            const attrib = this.product.customizationOptions.customizations[i];
            // if (attrib.type === "Colors") {
            //   this.product.customValues[attrib.key] =
            //     attrib.values.length > 0 ? attrib.values[0].hexValue : "";
            // } else {
            this.product.customValues[attrib.key] = attrib.values.length > 0 ? attrib.values[0] : '';
            // }
          }
        }
      } catch (err) {
        console.log(err);
        this.$notify({
          group: 'all',
          type: 'error',
          text:
            'Product detail could not be retrieved at the moment. Please try again later.',
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.product-detail {
  width: 80%;
  margin: auto;
  margin-bottom: 10px;
}
</style>
