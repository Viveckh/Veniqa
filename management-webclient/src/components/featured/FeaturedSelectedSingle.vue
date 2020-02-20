<template>
  <div id="featured-single">
    <b-row align-v="center">
      <b-col>
        <strong>{{designName}}</strong>
      </b-col>
      <b-col>
        <strong>Type:</strong>
        {{design.config.design_type}}
      </b-col>
      <b-col class="align-right">
        <a @click="$emit('remove')" class="red-anchor">Remove</a>
        <a @click="$emit('edit')" style="margin-left: 30px;" class="green-anchor">Edit</a>

        <a style="margin-left: 30px; font-size: x-large" @click="showDetail = !showDetail">
          <font-awesome-icon icon="sort-down"/>
        </a>
      </b-col>
    </b-row>
    <div class="featured-prd-dtl" v-show="showDetail">
      <ul class="inline-list">
        <li v-for="(product, pid) in design.products" :key="pid">
          <b-card class="product-card">
            <b-row>
              <b-col sm="4">
                <img
                  :src="product.detailedImageUrls[0]"
                  alt="No Image"
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
              </b-col>
            </b-row>
          </b-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeaturedSelectedSingle',
  props: {
    design: {
      type: Object,
      required: true,
    },

    section: {
      type: String,
      required: false,
      default: 'Section'
    },

    index: {
      type: Number,
      required: true,
    }
  },

  data() {
    return {
      showDetail: false,
    };
  },

  computed: {
    designName() {
      return this.design.config.name || `${this.section} Design - ${this.index}`;
    }
  }
};
</script>

<style lang="scss">
#featured-single {
  margin: 1rem 0px;
  background-color: whitesmoke;
  border-radius: 10px;
  padding: 0.5rem 1rem;

  .inline-list {
    li {
      width: 300px;
      padding: 10px;
    }
  }

  .green-anchor {
    color: green;
  }

  .featured-prd-dtl {
    li {
      max-width: 400px;
    }

    .card {
      margin-bottom: 0;
    }
  }
}
</style>
